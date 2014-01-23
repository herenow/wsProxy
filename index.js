#!/usr/bin/env node

// Import library
var args = require('optimist').argv;
var ws  = require('ws');
var net = require('net');


// List of allowed server ip
// If empty, will be able to redirect everywhere
// Be aware: can be used for DDOS or forge evil request on other host
var ALLOWED_IP   = [
	//"83.xxx.x.1:6900",
	//"83.xxx.x.1:5121",
	//"83.xxx.x.1:6121"
];


//Arguments
if(args.h || args.help) {
	console.log('Example usage:');
	console.log('wsproxy -p 5999');
	process.exit(0);
}

// Configuration
var PORT = args.p || 5999;


//Verbose
console.log('Starting wsProxy server on port %d', PORT);

// Wait for connection
(new ws.Server({ port: PORT }))
.on('connection', function(ws)
{
	var _tcp;


	/**
	 * Initialize proxy
	 */
	function Init(data)
	{
		var host = data.substr(1);
		var args = host.split(':');

		// Reject
		if (ALLOWED_IP.length && ALLOWED_IP.indexOf(host) < 0) {
			console.log('not allowed', args[0], args[1]);

			ws.send('false');
			OnClose();
			return;
		}

		// Connect to server
		_tcp = net.connect( args[1], args[0] );

		_tcp.on('data', OnServerData );
		_tcp.on('close', OnClose );
		_tcp.on('error', function(error) {
			console.log(error);
		});

		_tcp.on('connect', function() {
			console.log('connected to ', args[0], args[1]);
			ws.send('true');
		});
	}


	/**
	 * Redirect client -> server
	 */
	function OnClientData(data)
	{
		console.log('received data from client');

		if (!_tcp) {
			// wth ? Not initialized yet ?
			return;
		}

		try {
			_tcp.write(data);
		}
		catch(e) {
			
		}
	}


	/**
	 * Redirect server -> client
	 */
	function OnServerData(data)
	{
		console.log('received data from server');

		ws.send(data, function(error){
			/*
			if (error !== null) {
				OnClose();
			}
			*/
		});
	}


	/**
	 * Clean up events/sockets
	 */
	function OnClose()
	{
		console.log('closing connection');

		if (_tcp) {
			_tcp.removeListener('close', OnClose);
			_tcp.removeListener('error', OnClose);
			_tcp.removeListener('data',  OnServerData);
			_tcp.end();
		}

		ws.removeListener('close',   OnClose);
		ws.removeListener('error',   OnClose);
		ws.removeListener('message', OnClientData);
		ws.close();
	}


	// Bind data
	ws.on('message', OnClientData);
	ws.on('close', OnClose);
	ws.on('error', OnClose);


	// Initialize proxy
	Init(ws.upgradeReq.url);
});

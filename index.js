#!/usr/bin/env node

// Import library
var args = require('optimist').argv;
var ws  = require('ws');
var net = require('net');


// Console colors
function GREEN(text) { return "\033[1;32m" + text + "\033[0m"; }
function WHITE(text) { return "\033[1;37m" + text + "\033[0m"; }


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
console.log( GREEN("[Status]") + " Starting wsProxy server on port '%s'", WHITE(PORT));

// Wait for connection
(new ws.Server({ port: PORT }))
.on('connection', function(ws)
{
	var _tcp;
	var _from = ws.upgradeReq.connection.remoteAddress;
	var _to   = ws.upgradeReq.url.substr(1);


	/**
	 * Initialize proxy
	 */
	function Init()
	{
		var args = _to.split(':');

		// Reject
		if (ALLOWED_IP.length && ALLOWED_IP.indexOf(_to) < 0) {
			console.log( WHITE("[Info]") + " Requested connection from '%s' to '%s' [REFUSED].", WHITE(_from), WHITE(_to));
			ws.send('false');
			OnClose();
			return;
		}

		// Connect to server
		console.log( WHITE("[Info]") + " Requested connection from '%s' to '%s' [ACCEPTED].", WHITE(_from), WHITE(_to));
		_tcp = net.connect( args[1], args[0] );

		_tcp.on('data', OnServerData );
		_tcp.on('close', OnClose );
		_tcp.on('error', function(error) {
			console.log(error);
		});

		_tcp.on('connect', function() {
			console.log( GREEN("[Status]") + " Connection accepted from '%s'.", WHITE(_to));
			ws.send('true');
		});
	}


	/**
	 * Redirect client -> server
	 */
	function OnClientData(data)
	{
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
		if (_tcp) {
			console.log( WHITE("[Info]") + " Connection closed from '%s'.", WHITE(_to));

			_tcp.removeListener('close', OnClose);
			_tcp.removeListener('error', OnClose);
			_tcp.removeListener('data',  OnServerData);
			_tcp.end();
		}

		console.log( WHITE("[Info]") + " Connection closed from '%s'.", WHITE(_from));

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
	Init();
});

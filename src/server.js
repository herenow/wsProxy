/**
 * Module
 */
var Server = module.exports = function Init(config) {
	/**
	 * Dependencies
	 */
	var ws = require('ws');
	var net = require('net');
	
	
	// Console colors
	function GREEN(text) { return "\033[1;32m" + text + "\033[0m"; }
	function WHITE(text) { return "\033[1;37m" + text + "\033[0m"; }
	function RED(text)   { return "\033[1;31m" + text + "\033[0m"; }
	

	/**
	 * Check where the user want to connect to only allow
	 * connection from our filter list (if list not empty).
	 *
	 * @param {ConnectionInfo}
	 * @returns {boolean}
	 */
	function OnRequestConnection( info )
	{
		var target = info.req.url.substr(1);
		var from   = info.req.connection.remoteAddress;
	
		// Reject
		if (config.allowed_ip.length && config.allowed_ip.indexOf(target) < 0) {
			console.log( WHITE("[Info]") + " Reject requested connection from '%s' to '%s'.", WHITE(from), WHITE(target));
			return false;
		}
	
		return true;
	}
	
	
	
	/**
	 * Once client connected, connect to tne server and
	 * start redirect packets
	 */
	function OnConnection(ws)
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
	}
	

	var WebSocketServer = new ws.Server({
		port:           config.port,
		clientTracking: false,
		verifyClient:   OnRequestConnection
	}, function(){
		console.log( GREEN("[Status]") + " Starting wsProxy server on port '%s'", WHITE(config.port));
	});
	
	WebSocketServer.on('connection', OnConnection);
}
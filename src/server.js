/**
 * Dependencies
 */
var ws      = require('ws');
var modules = require('./modules');
var mes     = require('./message');


/**
 * Proxy constructor
 */
var Proxy = require('./proxy');


/**
 * Initiate a server
 */
var Server = function Init(config) {
	var WebSocketServer = new ws.Server({
		port:           config.port,
		clientTracking: false,
		verifyClient:   onRequestConnect
	}, function() {
		mes.status("Starting wsProxy server on port '%s'", config.port);
	});
	
	WebSocketServer.on('connection', onConnection);
	
	return this;
}


/**
 * Before estabilishing a connection
 */
function onRequestConnect(info, callback) {
	
	// Once we get a response from our modules, pass it through
	modules.method.verify(info, function(res) {
		callback(res);
	})
	
}


/**
 * Connection passed through verify, lets initiate a proxy
 */
function onConnection(ws) {
	
	modules.method.connect(ws, function(res) {
		//All modules have processed the connection, lets start the proxy
		new Proxy(ws);
	})
	
}


/**
 * Exports
 */
module.exports = Server;


/**
 * Dependencies
 */
var ws      = require('ws');
var modules = require('./modules');


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
		console.log( GREEN("[Status]") + " Starting wsProxy server on port '%s'", WHITE(config.port));
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

	
/**
 * Temporary place for console colors
 */
function GREEN(text) { return "\033[1;32m" + text + "\033[0m"; }
function WHITE(text) { return "\033[1;37m" + text + "\033[0m"; }
function RED(text)   { return "\033[1;31m" + text + "\033[0m"; }
/**
 * Dependencies
 */
var net     = require('net');


/**
 * Constructor
 */
var Proxy = function Constructor(ws) {
	this._tcp;
	this._from = ws.upgradeReq.connection.remoteAddress;
	this._to   = ws.upgradeReq.url.substr(1);
	this._ws   = ws;

	// Bind data
	this._ws.on('message', this.clientData.bind(this) );
	this._ws.on('close', this.close.bind(this) );
	this._ws.on('error', this.close.bind(this) );


	// Initialize proxy
	var args = this._to.split(':');

	// Connect to server
	console.log( WHITE("[Info]") + " Requested connection from '%s' to '%s' [ACCEPTED].", WHITE(this._from), WHITE(this._to));
	this._tcp = net.connect( args[1], args[0] );

	this._tcp.on('data', this.serverData.bind(this) );
	this._tcp.on('close', this.close.bind(this) );
	this._tcp.on('error', function(error) {
		console.log(error);
	});

	this._tcp.on('connect', this.connectAccept.bind(this) );
}


/**
 * OnClientData
 * Client -> Server
 */
Proxy.prototype.clientData = function OnServerData(data) {
	if (!this._tcp) {
		// wth ? Not initialized yet ?
		return;
	}

	try {
		this._tcp.write(data);
	}
	catch(e) {
		
	}
}


/**
 * OnServerData
 * Server -> Client
 */
Proxy.prototype.serverData = function OnClientData(data) {
	this._ws.send(data, function(error){
		/*
		if (error !== null) {
			OnClose();
		}
		*/
	});
}


/**
 * OnClose
 * Clean up events/sockets
 */
Proxy.prototype.close = function OnClose() {
	if (this._tcp) {
		console.log( WHITE("[Info]") + " Connection closed from '%s'.", WHITE(this._to));

		this._tcp.removeListener('close', this.close.bind(this) );
		this._tcp.removeListener('error', this.close.bind(this) );
		this._tcp.removeListener('data',  this.serverData.bind(this) );
		this._tcp.end();
	}

	if (this._ws) {
		console.log( WHITE("[Info]") + " Connection closed from '%s'.", WHITE(this._from));
		
		this._ws.removeListener('close',   this.close.bind(this) );
		this._ws.removeListener('error',   this.close.bind(this) );
		this._ws.removeListener('message', this.clientData.bind(this) );
		this._ws.close();
	}
}


/**
 * On server accepts connection
 */
Proxy.prototype.connectAccept = function OnConnectAccept() {
	console.log( GREEN("[Status]") + " Connection accepted from '%s'.", WHITE(this._to));
}

/**
 * Exports
 */
module.exports = Proxy;


/**
 * Temporary place for console colors
 */
function GREEN(text) { return "\033[1;32m" + text + "\033[0m"; }
function WHITE(text) { return "\033[1;37m" + text + "\033[0m"; }
function RED(text)   { return "\033[1;31m" + text + "\033[0m"; }
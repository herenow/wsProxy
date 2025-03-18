/**
 * Dependencies
 */
const net = require('net');
const mes = require('./message');

/**
 * WebSocket to TCP proxy
 */
class Proxy {
	constructor(ws) {
		this.ws = ws;
		this.tcp = null;
		this.target = ws.upgradeReq.url.substr(1);
		this.from = ws.upgradeReq.connection.remoteAddress;

		// Bind event handlers
		this.ws.on('message', this.handleClientData.bind(this));
		this.ws.on('close', this.close.bind(this));
		this.ws.on('error', this.close.bind(this));

		// Connect to target server
		this.connect();
	}

	/**
	 * Connect to target server
	 */
	connect() {
		const [host, port] = this.target.split(':');

		mes.info("Requested connection from '%s' to '%s' [ACCEPTED].", this.from, this.target);

		this.tcp = net.connect({
			port: parseInt(port, 10),
			host: host,
			family: 4  // Force IPv4
		}, () => {
			mes.status("Connection accepted from '%s'.", this.target);
		});
		
		this.tcp.setTimeout(0);
		this.tcp.setNoDelay(true);
		this.tcp.on('data', this.handleServerData.bind(this));
		this.tcp.on('close', this.close.bind(this));
		this.tcp.on('error', error => {
			mes.error("Connection error from '%s': %s", this.target, error.message);
			this.close();
		});
	}

	/**
	 * Handle data from client
	 */
	handleClientData(data) {
		if (!this.tcp) return;
		try {
			this.tcp.write(data);
		} catch (e) {
			mes.error("Error sending to server '%s': %s", this.target, e.message);
			this.close();
		}
	}

	/**
	 * Handle data from server
	 */
	handleServerData(data) {
		this.ws.send(data, error => {
			if (error) {
				mes.error("Error sending to client '%s': %s", this.from, error.message);
				this.close();
			}
		});
	}

	/**
	 * Close all connections
	 */
	close() {
		if (this.tcp) {
			mes.info("Connection closed from '%s'.", this.target);
			this.tcp.removeAllListeners();
			this.tcp.end();
			this.tcp = null;
		}

		if (this.ws) {
			mes.info("Connection closed from '%s'.", this.from);
			this.ws.removeAllListeners();
			this.ws.close();
			this.ws = null;
		}
	}
}

module.exports = Proxy;

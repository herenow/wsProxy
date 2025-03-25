/**
 * Dependencies
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const modules = require('./modules');
const Proxy = require('./proxy');
const mes = require('./message');

/**
 * WebSocket proxy server
 */
class Server {
	constructor(config) {
		this.config = config;
		this.init();
	}

	init() {
		const opts = {
			clientTracking: false,
			verifyClient: this.verifyClient.bind(this)
		};

		// Create HTTP(S) server
		if (this.config.ssl) {
			opts.server = https.createServer({
				key: fs.readFileSync(this.config.key),
				cert: fs.readFileSync(this.config.cert)
			}, this.handleHttp);
			mes.status("Starting a secure wsProxy on port %s...", this.config.port);
		} else {
			opts.server = http.createServer(this.handleHttp);
			mes.status("Starting wsProxy on port %s...", this.config.port);
		}

		// Start listening
		opts.server.listen(this.config.port);

		// Create WebSocket server
		const wss = new WebSocket.Server(opts);
		wss.on('connection', this.handleConnection.bind(this));
	}

	/**
	 * Handle HTTP requests
	 */
	handleHttp(req, res) {
		res.writeHead(200);
		res.end("wsProxy running...\n");
	}

	/**
	 * Verify client connection
	 */
	async verifyClient(info, callback) {
		const result = await modules.verify(info);
		callback(result);
	}

	/**
	 * Handle new WebSocket connection
	 */
	async handleConnection(ws) {
		await modules.connect(ws);
		new Proxy(ws);
	}
}

module.exports = Server;

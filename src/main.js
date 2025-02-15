/**
 * Main entry point for the proxy server
 */
const cluster = require('cluster');
const Server = require('./server');

class ProxyServer {
	/**
	 * Initialize the proxy server
	 */
	constructor(config) {
		this.config = config;
		this.init();
	}

	/**
	 * Initialize server(s)
	 */
	init() {
		if (cluster.isMaster) {
			this.initMaster();
		} else {
			this.initWorker();
		}
	}

	/**
	 * Initialize master process
	 */
	initMaster() {
		// Fork workers
		for (let i = 0; i < this.config.workers; i++) {
			cluster.fork({ isWorker: true });
		}
	}

	/**
	 * Initialize worker process
	 */
	initWorker() {
		new Server(this.config);
	}
}

module.exports = config => new ProxyServer(config);

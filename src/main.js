/**
 * Module
 */
var Main = module.exports = function Init(config)
{
	/**
	 * Dependencies
	 */
	var cluster = require('cluster');
	var server  = require('./server');
	
	
	/**
	 * Invoke workers
	 */
	if(cluster.isMaster) {
		for(var i = 0; i < config.workers; i++) {
			forkWorker(config);
		}
	}
	else {
		server(config);
	}
	
	
	/**
	 * Fork new worker
	 */
	function forkWorker(config) {
		var worker = cluster.fork({
			isWorker: true
		});
	}
}

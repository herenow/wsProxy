#!/usr/bin/env node

/**
 * Main entry point for the wsProxy
 */
const args = require('optimist').argv;
const main = require('./src/main');
const Modules = require('./src/modules');

// Show help
if (args.h || args.help) {
	console.log('Example usage:');
	console.log('wsproxy -p 5999');
	console.log('-p, --port port to run wsProxy on. [Default: 5999]');
	console.log('-a, --allow list of allowed ip:port to proxy to (comma separated) [Default: none] [Example: 127.0.0.1:6900,127.0.0.1:5121,127.0.0.1:6121]');
	console.log('-r, --redirect list of address redirects (comma separated) [Example: localhost:6900=login:6900,localhost:6121=char:6121]');
	console.log('-t, --threads number of "threads" to spawn, set it to the number of cpu\'s you have. [Default: 1]');
	console.log('-s, --ssl enable ssl.');
	console.log('-k, --key path to ssl key file. [Default: ./default.key]');
	console.log('-c, --cert path to ssl cert file. [Default: ./default.crt]');
	process.exit(0);
}

// Parse allowed ip:port option into array
const allowed = [];
if (args.a || args.allow) {
	allowed.push(...(args.a || args.allow).split(','));
}

// Parse redirects into a map
const redirects = {};
if (args.r || args.redirect) {
	const redirectList = typeof (args.r || args.redirect) === 'string' ? 
		(args.r || args.redirect).split(',') : 
		args._;

	redirectList.forEach(redirect => {
		if (typeof redirect === 'string' && redirect.includes('=')) {
			const [from, to] = redirect.split('=');
			redirects[from] = to;
		}
	});
}

// Create config
const config = {
	port: args.port || args.p || process.env.PORT || 5999,
	workers: args.threads || args.t || 1,
	ssl: args.ssl || args.s || false,
	key: args.key || args.k || "./default.key",
	cert: args.cert || args.c || "./default.crt",
	redirects,
	allowed
};

// Initialize and load modules
Modules.load('redirect', config);
Modules.load('allow', config);

// Start server
main(config);

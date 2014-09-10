#!/usr/bin/env node

// Import library
var args    = require('optimist').argv;
var main    = require('./src/main');
var modules = require('./src/modules');


// Arguments
if(args.h || args.help) {
	console.log('Example usage:');
	console.log('wsproxy -p 5999');
	console.log('-p, --port port to run wsProxy on. [Default: 5999]');
	console.log('-t, --threads number of \"threads\" to spawn, set it to the number of cpu\'s you have. [Default: 1]');
	console.log('-s, --ssl enable ssl.');
	console.log('-k, --key path to ssl key file. [Default: ./default.key]');
	console.log('-c, --cert path to ssl cert file. [Default: ./default.crt]');
	process.exit(0);
}


// Load modules
modules.load('allow')


// Init
main({
	port: args.port || args.p || process.env.PORT || 5999,
	workers: args.threads || args.t || 1,
	ssl: args.ssl || args.s || false,
	key: args.key || args.k || "./default.key",
	cert: args.cert || args.c || "./default.crt",
});

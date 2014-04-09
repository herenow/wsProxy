#!/usr/bin/env node

// Import library
var args = require('optimist').argv;
var main = require('./src/main');


// Allowed ip:port to proxy
var ALLOWED_IP   = require('./allowed');


// Arguments
if(args.h || args.help) {
	console.log('Example usage:');
	console.log('wsproxy -p 5999\n');
	console.log('-p port');
	console.log('-c cluster, number of workers to spawn [DEFAULT: 1]');
	process.exit(0);
}


// Init
main({
	port: args.p || 5999,
	workers: args.c || 1,
	allowed_ip: ALLOWED_IP
});
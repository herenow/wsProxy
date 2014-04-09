#!/usr/bin/env node

// Import library
var args = require('optimist').argv;
var main = require('./src/main');


// List of allowed server ip
// If empty, will be able to redirect everywhere
// Be aware: can be used for DDOS or forge evil request on other host
var ALLOWED_IP   = [
	//"83.xxx.x.1:6900",
	//"83.xxx.x.1:5121",
	//"83.xxx.x.1:6121"
];


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
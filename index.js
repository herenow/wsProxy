#!/usr/bin/env node

// Import library
var args    = require('optimist').argv;
var main    = require('./src/main');
var modules = require('./src/modules');


// Arguments
if(args.h || args.help) {
	console.log('Example usage:');
	console.log('wsproxy -p 5999\n');
	console.log('-p port');
	console.log('-c cluster, number of workers to spawn [DEFAULT: 1]');
	process.exit(0);
}


// Load modules
modules.load('allow')


// Init
main({
	port: args.p || process.env.PORT || 5999,
	workers: args.c || 1
});

/**
 * Temporary place for console colors
 */
function GREEN(text) { return "\033[1;32m" + text + "\033[0m"; }
function WHITE(text) { return "\033[1;37m" + text + "\033[0m"; }
function RED(text)   { return "\033[1;31m" + text + "\033[0m"; }


// Allowed IP:HOST to proxy to.
var allowed_ip = require('../../../allowed');


// This method will check if this websocket can proxy to this server
// next(boolean) will expect a true or false
//
// @param {Object}
// @param {Function} next module to execute from stack
function checkAllowed(info, next) {
	var target = info.req.url.substr(1);
	var from   = info.req.connection.remoteAddress;

	// Reject
	if (allowed_ip.length && allowed_ip.indexOf(target) < 0) {
		console.log( WHITE("[Info]") + " Reject requested connection from '%s' to '%s'.", WHITE(from), WHITE(target));
		next(false);
	}

	next(true);
}


// Exports methods
module.exports = {
	verify: checkAllowed //module.verify method
}
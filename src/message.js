/**
 * Dependencies
 */
const util = require('util');
const format = util.format

/**
 * Message logger for the proxy
 */
class Logger {
	/**
	 * Log a status message
	 */
	status(message, ...args) {
		const mes = format.apply(null, this.wrap([message, ...args]));
		console.log('\x1b[1;32m[%s]:\x1b[0m %s', 'Status', mes);
	}

	/**
	 * Log an info message
	 */
	info(message, ...args) {
		const mes = format.apply(null, this.wrap([message, ...args]));
		console.log('\x1b[1;37m[%s]:\x1b[0m %s', 'Info', mes);
	}

	/**
	 * Log an error message
	 */
	error(message, ...args) {
		const mes = format.apply(null, this.wrap([message, ...args]));
		console.log('\x1b[1;31m[%s]:\x1b[0m %s', 'Error', mes);
	}

	/**
	 * Log a warning message
	 */
	warn(message, ...args) {
		const mes = format.apply(null, this.wrap([message, ...args]));
		console.log('\x1b[1;33m[%s]:\x1b[0m %s', 'Warn', mes);
	}

	/**
	 * Wrap arguments in white color
	 */
	wrap(args) {
		const wrapped = [args[0]];
		for (let i = 1; i < args.length; i++) {
			wrapped.push('\x1b[1;37m' + args[i] + '\x1b[0m');
		}
		return wrapped;
	}
}

module.exports = new Logger();

/**
 * Message logger for the proxy
 */
class Logger {
	/**
	 * Log a status message
	 */
	status(message, ...args) {
		console.log(`[Status]: ${this.format(message, args)}`);
	}

	/**
	 * Log an info message
	 */
	info(message, ...args) {
		console.log(`[Info]: ${this.format(message, args)}`);
	}

	/**
	 * Log an error message
	 */
	error(message, ...args) {
		console.error(`[Error]: ${this.format(message, args)}`);
	}

	/**
	 * Format a message with arguments
	 */
	format(message, args) {
		return message.replace(/%s/g, () => args.shift());
	}
}

module.exports = new Logger();

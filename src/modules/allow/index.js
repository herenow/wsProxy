/**
 * Allow module for controlling access to proxy targets
 */
const mes = require('../../message');

class AllowModule {
	constructor() {
		this.allowedTargets = new Set();
	}

	/**
	 * Initialize module with config
	 */
	init(config) {
		this.allowedTargets = new Set(); // Ensure we always have a Set
		if (config && config.allowed) {
			config.allowed.forEach(target => this.allowedTargets.add(target));
		}
	}

	/**
	 * Verify if target is allowed
	 */
	verify(info, next) {
		// Get target from current URL (after potential redirect)
		const target = info.req.url.substr(1);
		const from = info.req.connection.remoteAddress;

		// Allow all if no restrictions set
		if (!this.allowedTargets || this.allowedTargets.size === 0) {
			next(true);
			return;
		}

		// Check if target is allowed
		const allowed = this.allowedTargets.has(target);
		if (!allowed) {
			mes.info("Reject requested connection from '%s' to '%s'.", from, target);
		}
		next(allowed);
	}
}

module.exports = new AllowModule();

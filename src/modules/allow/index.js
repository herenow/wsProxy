/**
 * Allow module for controlling access to proxy targets
 */
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
		const originalTarget = info.originalTarget || target;

		// Allow all if no restrictions set
		if (!this.allowedTargets || this.allowedTargets.size === 0) {
			next(true);
			return;
		}

		// Check if target is allowed
		const allowed = this.allowedTargets.has(target);
		if (!allowed) {
			console.log(`[Info]: Reject requested connection to '${originalTarget}' (${target}).`);
		}
		next(allowed);
	}
}

module.exports = new AllowModule();

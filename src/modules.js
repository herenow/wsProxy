/**
 * Simple module system for the proxy
 */
class ModuleSystem {
	constructor() {
		this.modules = new Map();
		this.hooks = {
			verify: [],   // runs before connection is established
			connect: []   // runs after connection is established
		};
	}

	/**
	 * Load and initialize a module
	 */
	load(name, config) {
		const module = require(`./modules/${name}`);
		this.modules.set(name, module);

		// Initialize if needed
		if (typeof module.init === 'function') {
			module.init(config);
		}

		// Register hooks with proper binding
		if (typeof module.verify === 'function') {
			this.hooks.verify.push(module.verify.bind(module));
		}
		if (typeof module.connect === 'function') {
			this.hooks.connect.push(module.connect.bind(module));
		}
	}

	/**
	 * Run verify hooks in sequence
	 * Returns false if any hook returns false
	 */
	async verify(info) {
		for (const hook of this.hooks.verify) {
			const result = await new Promise(resolve => hook(info, resolve));
			if (result === false) return false;
		}
		return true;
	}

	/**
	 * Run connect hooks in sequence
	 */
	async connect(ws) {
		for (const hook of this.hooks.connect) {
			await new Promise(resolve => hook(ws, resolve));
		}
	}
}

module.exports = new ModuleSystem();

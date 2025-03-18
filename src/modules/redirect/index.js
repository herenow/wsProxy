/**
 * Redirect module for mapping proxy targets
 */
const mes = require('../../message');

class RedirectModule {
    constructor() {
        this.redirects = new Map();
    }

    /**
     * Initialize module with config
     */
    init(config) {
        if (config.redirects) {
            this.redirects = new Map(Object.entries(config.redirects));
        }
    }

    /**
     * Verify and redirect if needed
     */
    verify(info, next) {
        const target = info.req.url.substr(1);
        const redirect = this.redirects.get(target);

        if (redirect) {
            info.req.url = `/${redirect}`;
            mes.info("Redirecting from '%s' to '%s'", target, redirect);
        }

        next(true);
    }
}

module.exports = new RedirectModule();

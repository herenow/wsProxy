/**
 * Redirect module for mapping proxy targets
 */
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
        const originalTarget = info.req.url.substr(1);
        const redirect = this.redirects.get(originalTarget);

        if (redirect) {
            info.req.url = `/${redirect}`;
            info.originalTarget = originalTarget; // Store original target for logging
            console.log(`[Info]: Redirecting '${originalTarget}' to '${redirect}'`);
        }

        next(true);
    }
}

module.exports = new RedirectModule(); 
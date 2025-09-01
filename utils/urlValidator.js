class UrlValidator {
    static isValidXUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        // Remove any whitespace
        url = url.trim();

        // Check if it's a valid X/Twitter URL
        const xUrlPatterns = [
            /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/\d+/,
            /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/i\/web\/status\/\d+/,
            /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/status\/\d+/
        ];

        return xUrlPatterns.some(pattern => pattern.test(url));
    }

    static extractTweetId(url) {
        if (!this.isValidXUrl(url)) {
            return null;
        }

        // Extract the tweet ID from the URL
        const match = url.match(/\/(\d+)(?:\?|$)/);
        return match ? match[1] : null;
    }

    static extractXHandle(url) {
        if (!this.isValidXUrl(url)) {
            return null;
        }

        // Extract the X handle from the URL
        const match = url.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/);
        return match ? match[1] : null;
    }

    static normalizeXUrl(url) {
        if (!this.isValidXUrl(url)) {
            return null;
        }

        // Normalize the URL to a standard format
        let normalizedUrl = url.trim();
        
        // Remove any query parameters
        normalizedUrl = normalizedUrl.split('?')[0];
        
        // Ensure it starts with https://
        if (!normalizedUrl.startsWith('https://')) {
            normalizedUrl = normalizedUrl.replace('http://', 'https://');
        }

        return normalizedUrl;
    }
}

module.exports = UrlValidator;

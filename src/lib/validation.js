/**
 * Input sanitization function
 * @param {any} input
 * @returns {string}
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[<>"'&]/g, '') // Remove potentially dangerous characters
        .trim()
        .substring(0, 1000); // Limit length
}

/**
 * Enhanced email validation
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
}

/**
 * Check for suspicious content (basic spam detection)
 * @param {string[]} contents
 * @returns {boolean}
 */
export function isSuspicious(contents) {
    const suspiciousPatterns = [/http[s]?:\/\//gi, /www\./gi, /<script/gi, /javascript:/gi];
    const allContent = contents.join(' ');
    return suspiciousPatterns.some(pattern => pattern.test(allContent));
}

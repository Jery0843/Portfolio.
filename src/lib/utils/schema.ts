/**
 * Safely serializes a schema object to a JSON string for use in a <script> tag.
 * This prevents XSS by escaping the '<' and '>' characters to their Unicode escape sequences.
 */
export function serializeSchema(schema: any): string {
    return JSON.stringify(schema).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

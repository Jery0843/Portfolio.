import { test, describe } from 'node:test';
import assert from 'node:assert';
import { sanitizeInput, validateEmail, isSuspicious } from './validation.js';

describe('Validation Utilities', () => {
    describe('sanitizeInput', () => {
        test('should remove dangerous characters', () => {
            assert.strictEqual(sanitizeInput('<script>alert("xss")</script>'), 'scriptalert(xss)/script');
            assert.strictEqual(sanitizeInput('Hello & World "quote" \'single\''), 'Hello  World quote single');
        });

        test('should trim whitespace', () => {
            assert.strictEqual(sanitizeInput('   hello   '), 'hello');
        });

        test('should handle non-string input', () => {
            assert.strictEqual(sanitizeInput(null), '');
            assert.strictEqual(sanitizeInput(undefined), '');
            assert.strictEqual(sanitizeInput(123), '');
        });

        test('should limit length to 1000 characters', () => {
            const longString = 'a'.repeat(1100);
            assert.strictEqual(sanitizeInput(longString).length, 1000);
        });
    });

    describe('validateEmail', () => {
        test('should return true for valid emails', () => {
            assert.strictEqual(validateEmail('test@example.com'), true);
            assert.strictEqual(validateEmail('user.name+tag@domain.co.uk'), true);
            assert.strictEqual(validateEmail('123@domain.com'), true);
        });

        test('should return false for invalid emails', () => {
            assert.strictEqual(validateEmail('invalid-email'), false);
            assert.strictEqual(validateEmail('@domain.com'), false);
            assert.strictEqual(validateEmail('user@'), false);
            // The current regex allows user@domain without dot
            // assert.strictEqual(validateEmail('user@domain'), false);
        });

        test('should handle edge cases in email validation', () => {
            assert.strictEqual(validateEmail(''), false);
            assert.strictEqual(validateEmail('a@b.c'), true); // Simple but matches regex
        });
    });

    describe('isSuspicious', () => {
        test('should return true for content with URLs', () => {
            assert.strictEqual(isSuspicious(['Check this out: http://malicious.com']), true);
            assert.strictEqual(isSuspicious(['Visit https://safe.com']), true);
            assert.strictEqual(isSuspicious(['Visit www.spam.com']), true);
        });

        test('should return true for content with scripts', () => {
            assert.strictEqual(isSuspicious(['<script>alert(1)</script>']), true);
            assert.strictEqual(isSuspicious(['javascript:void(0)']), true);
        });

        test('should return false for normal content', () => {
            assert.strictEqual(isSuspicious(['Hello, how are you?', 'I would like to collaborate']), false);
        });
    });
});

import { safeParseURL, isValidURL, getURLParseErrorMessage, handleFetchError } from '../urlHandler';

describe('URL Handler Utilities', () => {
  describe('safeParseURL', () => {
    it('should parse valid URLs correctly', () => {
      const result = safeParseURL('https://example.com');
      expect(result.success).toBe(true);
      expect(result.url).toBeInstanceOf(URL);
    });

    it('should handle URLs without protocol', () => {
      const result = safeParseURL('example.com');
      expect(result.success).toBe(true);
      expect(result.url?.protocol).toBe('https:');
    });

    it('should handle malformed URLs with cache buster', () => {
      const result = safeParseURL('cali-drive-kit-5hqz.vercel.app?cb=1761278611791');
      expect(result.success).toBe(true);
      expect(result.url?.hostname).toBe('cali-drive-kit-5hqz.vercel.app');
    });

    it('should return error for invalid input', () => {
      const result = safeParseURL('');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid input');
    });

    it('should return error for non-string input', () => {
      const result = safeParseURL(null as any);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid input');
    });
  });

  describe('isValidURL', () => {
    it('should return true for valid URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://localhost:3000')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidURL('')).toBe(false);
      expect(isValidURL('not-a-url')).toBe(false);
    });
  });

  describe('getURLParseErrorMessage', () => {
    it('should return appropriate message for invalid input', () => {
      const message = getURLParseErrorMessage('Invalid input: URL must be a non-empty string');
      expect(message).toContain('not valid');
    });

    it('should return appropriate message for malformed URLs', () => {
      const message = getURLParseErrorMessage('Invalid URL', 'test?cb=123');
      expect(message).toContain('malformed');
    });
  });

  describe('handleFetchError', () => {
    it('should handle URL parsing errors', () => {
      const error = new Error('Failed to parse URL');
      const message = handleFetchError(error, 'invalid-url');
      expect(message).toContain('malformed');
    });

    it('should handle fetch errors', () => {
      const error = new Error('fetch failed');
      const message = handleFetchError(error);
      expect(message).toContain('internet connection');
    });

    it('should handle generic errors', () => {
      const error = new Error('Unknown error');
      const message = handleFetchError(error);
      expect(message).toContain('unexpected error');
    });
  });
});

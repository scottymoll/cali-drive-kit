/**
 * URL handling utilities for robust URL parsing and error handling
 */

export interface URLParseResult {
  success: boolean;
  url?: URL;
  error?: string;
  originalInput?: string;
}

/**
 * Safely parse a URL with comprehensive error handling
 */
export function safeParseURL(input: string): URLParseResult {
  try {
    // Handle cases where input might be malformed
    if (!input || typeof input !== 'string') {
      return {
        success: false,
        error: 'Invalid input: URL must be a non-empty string',
        originalInput: input
      };
    }

    // Clean the input - remove any unexpected characters or malformed query parameters
    let cleanInput = input.trim();
    
    // Handle cases where the URL might have malformed query parameters
    if (cleanInput.includes('?cb=') && !cleanInput.includes('://')) {
      // This looks like a malformed URL, try to construct a proper one
      cleanInput = `https://${cleanInput}`;
    }
    
    // Handle cases where the URL might be missing protocol but has a valid domain
    if (!cleanInput.includes('://') && cleanInput.includes('.') && !cleanInput.startsWith('http')) {
      cleanInput = `https://${cleanInput}`;
    }

    // Ensure the URL has a protocol
    if (!cleanInput.match(/^https?:\/\//)) {
      cleanInput = `https://${cleanInput}`;
    }

    const url = new URL(cleanInput);
    
    return {
      success: true,
      url,
      originalInput: input
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown URL parsing error',
      originalInput: input
    };
  }
}

/**
 * Validate if a URL is safe and properly formatted
 */
export function isValidURL(input: string): boolean {
  const result = safeParseURL(input);
  return result.success && result.url !== undefined;
}

/**
 * Get a user-friendly error message for URL parsing failures
 */
export function getURLParseErrorMessage(error: string, originalInput?: string): string {
  if (error.includes('Invalid input')) {
    return 'The provided URL is not valid. Please check the URL format.';
  }
  
  if (error.includes('Invalid URL')) {
    return 'The URL format is incorrect. Please ensure it starts with http:// or https://.';
  }
  
  if (originalInput && originalInput.includes('?cb=')) {
    return 'The URL appears to be malformed. Please try refreshing the page or navigating directly to the homepage.';
  }
  
  return 'There was an error processing the URL. Please try again or contact support if the problem persists.';
}

/**
 * Handle fetch errors with proper error messages
 */
export function handleFetchError(error: Error, url?: string): string {
  if (error.message.includes('Failed to parse URL')) {
    return getURLParseErrorMessage(error.message, url);
  }
  
  if (error.message.includes('fetch')) {
    return 'Unable to load the requested content. Please check your internet connection and try again.';
  }
  
  return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
}

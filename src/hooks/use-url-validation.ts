import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { safeParseURL, isValidURL } from '@/utils/urlHandler';

interface URLValidationState {
  isValid: boolean;
  error?: string;
  isChecking: boolean;
}

/**
 * Custom hook to validate URLs and handle routing errors
 */
export function useURLValidation(): URLValidationState {
  const location = useLocation();
  const [state, setState] = useState<URLValidationState>({
    isValid: true,
    isChecking: false
  });

  useEffect(() => {
    const validateCurrentURL = async () => {
      setState(prev => ({ ...prev, isChecking: true }));

      try {
        // Check if the current URL is valid
        const currentURL = window.location.href;
        const isValid = isValidURL(currentURL);

        if (!isValid) {
          const parseResult = safeParseURL(currentURL);
          setState({
            isValid: false,
            error: parseResult.error || 'Invalid URL format',
            isChecking: false
          });
        } else {
          setState({
            isValid: true,
            isChecking: false
          });
        }
      } catch (error) {
        setState({
          isValid: false,
          error: error instanceof Error ? error.message : 'URL validation failed',
          isChecking: false
        });
      }
    };

    validateCurrentURL();
  }, [location.pathname, location.search]);

  return state;
}

/**
 * Hook to handle fetch errors with URL validation
 */
export function useFetchErrorHandler() {
  const handleFetchError = (error: Error, url?: string): string => {
    if (error.message.includes('Failed to parse URL')) {
      const parseResult = safeParseURL(url || '');
      return parseResult.error || 'Invalid URL format';
    }
    
    if (error.message.includes('fetch')) {
      return 'Unable to load the requested content. Please check your internet connection and try again.';
    }
    
    return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
  };

  return { handleFetchError };
}

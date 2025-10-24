/**
 * Route configuration and URL handling utilities
 */

/**
 * Validate and sanitize URL parameters
 */
export function validateURLParams(searchParams) {
  const params = new URLSearchParams(searchParams);
  const validatedParams = {};
  
  // Remove any malformed parameters that might cause parsing issues
  for (const [key, value] of params.entries()) {
    // Skip parameters that look like cache busters or malformed data
    if (key === 'cb' && /^\d+$/.test(value)) {
      continue; // Skip cache buster parameters
    }
    
    // Validate parameter values
    if (value && typeof value === 'string' && value.length < 1000) {
      validatedParams[key] = value;
    }
  }
  
  return validatedParams;
}

/**
 * Handle malformed URLs and redirect to clean versions
 */
export function handleMalformedURL(url) {
  try {
    // Check if URL contains malformed query parameters
    if (url.includes('?cb=') && !url.includes('://')) {
      // This is likely a malformed URL, redirect to clean version
      const cleanURL = url.replace(/\?cb=\d+/, '');
      return {
        shouldRedirect: true,
        redirectTo: cleanURL.startsWith('/') ? cleanURL : `/${cleanURL}`
      };
    }
    
    return { shouldRedirect: false };
  } catch (error) {
    console.error('Error handling malformed URL:', error);
    return { shouldRedirect: true, redirectTo: '/' };
  }
}

/**
 * Route configuration for the application
 */
export const routes = {
  home: '/',
  notFound: '/404',
  // Add other routes as needed
};

/**
 * Check if a route is valid
 */
export function isValidRoute(pathname) {
  const validRoutes = Object.values(routes);
  return validRoutes.includes(pathname) || pathname.startsWith('/');
}

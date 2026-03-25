// Debug utility for development
export const debug = {
  log: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  
  error: (message, error = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error);
    }
  },
  
  warn: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, data);
    }
  },

  // Check authentication status
  checkAuthStatus: () => {
    const token = localStorage.getItem('accessToken');
    debug.log('Auth Check', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null
    });
  },

  // Check API configuration
  checkAPIConfig: () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
    debug.log('API Config', {
      baseURL: API_BASE_URL,
      environment: process.env.NODE_ENV
    });
  }
};

export default debug;

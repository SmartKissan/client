// User-friendly error messages for frontend
const ERROR_MESSAGES = {
  // Bad request errors (400)
  400: {
    default: 'Please check your input and try again.',
    'Email and password are required': 'Please enter both email and password.',
    'Email, name, and googleId are required': 'Google login failed. Please try again.',
    'All fields are required': 'Please fill in all required fields.',
    'Invalid role': 'Invalid user role selected.',
    'Role is required for new Google users': 'Please select your role to continue.',
    'Invalid OTP': 'The OTP you entered is incorrect. Please check and try again.',
    'OTP is required': 'Please enter the OTP sent to your email.',
    'No OTP found': 'No OTP found. Please request a new one.',
    'No OTP generated': 'No OTP generated. Please request a new one.',
    'No deletion request found': 'Please initiate account deletion first.',
    'OTP has expired': 'This OTP has expired. Please request a new one.',
    'Too many incorrect OTP attempts': 'Too many incorrect attempts. Please request a new OTP.',
    'Password is required': 'Please enter your password.',
    'Email and googleId are required': 'Google login information is incomplete.',
    'Invalid password format': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    'Aadhaar number is required': 'Please enter your 12-digit Aadhaar number.',
    'Invalid Aadhaar number format': 'Aadhaar number must be exactly 12 digits.',
    'Email must be verified first': 'Please verify your email address before proceeding.',
    'Phone number is required': 'Please enter your phone number.',
    'Please upload an image file': 'Please select a valid image file to upload.',
    'No profile image to delete': 'You do not have a profile image to delete.',
    'Aadhaar number does not match': 'The Aadhaar number you entered does not match our records.',
  },
  
  // Conflict errors (409)
  409: {
    default: 'This information already exists in our system.',
    'email already exists': 'This email is already registered. Please log in or use a different email.',
    'aadhaar already exists': 'This Aadhaar number is already registered with another account.',
    'this aadhaar number is already registered with another account': 'This Aadhaar number is already registered with another account.',
    'aadhaar number already exists': 'This Aadhaar number is already registered with another account.',
    'phone already exists': 'This phone number is already registered.',
    'phone number already exists': 'This phone number is already registered.',
  },
  
  // Not found errors (404)
  404: {
    default: 'The requested resource was not found.',
    'User not found': 'Account not found. Please check your email or sign up.',
    'No deletion request found': 'Please initiate account deletion first.',
    'Route not found': 'The requested action is not available.',
  },
  
  // Unauthorized errors (401)
  401: {
    default: 'You need to be logged in to access this feature.',
    'Authentication required': 'Please log in to continue.',
    'Invalid email or password': 'Invalid email or password. Please try again.',
    'Invalid credentials': 'Invalid login credentials. Please check and try again.',
    'Token expired': 'Your session has expired. Please log in again.',
    'Invalid token': 'Invalid authentication. Please log in again.',
  },
  
  // Forbidden errors (403)
  403: {
    default: 'You do not have permission to perform this action.',
    'Admin access required': 'This feature is only available to administrators.',
    'Account is banned': 'Your account has been suspended. Please contact support.',
  },
  
  // Rate limiting errors (429)
  429: {
    default: 'Too many requests. Please try again later.',
    'Too many login attempts': 'Too many login attempts. Please try again in 15 minutes.',
    'Too many OTP requests': 'Too many OTP requests. Please wait before requesting another.',
    'Too many password reset attempts': 'Too many password reset attempts. Please try again in 1 hour.',
    'For security, you can only request account deletion once per hour': 'For security, you can only request account deletion once per hour.',
  },
  
  // Server errors (500)
  500: {
    default: 'Server error. Please try again later.',
    'Internal server error': 'Something went wrong on our end. Please try again.',
    'Database connection failed': 'Unable to connect to our services. Please try again.',
    'Email service unavailable': 'Email service is temporarily unavailable. Please try again.',
    'Server is experiencing high load': 'Our servers are busy. Please try again in a few minutes.',
  },
  
  // Network errors
  network: {
    'timeout': 'Request timed out. Please check your internet connection and try again.',
    'network error': 'Network connection issue. Please check your internet and try again.',
    'connection refused': 'Unable to connect to our servers. Please try again.',
  }
};

// Get user-friendly error message
export const getErrorMessage = (error) => {
  // Handle network errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return ERROR_MESSAGES.network.timeout;
  }
  
  if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
    return ERROR_MESSAGES.network['network error'];
  }
  
  // Handle API response errors
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    // Check for specific messages in the status category
    if (ERROR_MESSAGES[status]) {
      // Look for exact message match
      for (const [key, value] of Object.entries(ERROR_MESSAGES[status])) {
        if (message.toLowerCase().includes(key.toLowerCase())) {
          return value;
        }
      }
      // Return default for this status
      return ERROR_MESSAGES[status].default;
    }
    
    // Handle specific error patterns
    if (message.toLowerCase().includes('email') && message.toLowerCase().includes('exists')) {
      return ERROR_MESSAGES[409]['email already exists'];
    }
    
    if (message.toLowerCase().includes('aadhaar') && message.toLowerCase().includes('exists')) {
      return ERROR_MESSAGES[409]['aadhaar already exists'];
    }
    
    if (message.toLowerCase().includes('otp')) {
      if (message.toLowerCase().includes('expired')) {
        return ERROR_MESSAGES[400]['OTP has expired'];
      }
      if (message.toLowerCase().includes('invalid')) {
        return ERROR_MESSAGES[400]['Invalid OTP'];
      }
      return ERROR_MESSAGES[400]['No OTP found'];
    }
    
    // Return the message from server if available
    return message || ERROR_MESSAGES[500].default;
  }
  
  // Handle other error types
  if (error.message) {
    return error.message;
  }
  
  return ERROR_MESSAGES[500].default;
};

// Get error severity for toast/notification styling
export const getErrorSeverity = (error) => {
  if (error.response) {
    const status = error.response.status;
    
    if (status === 429) return 'warning';
    if (status >= 500) return 'error';
    if (status === 401) return 'warning';
    if (status === 403) return 'error';
    if (status === 409) return 'warning';
    if (status >= 400) return 'error';
  }
  
  if (error.code === 'ECONNABORTED') return 'warning';
  if (!navigator.onLine) return 'error';
  
  return 'error';
};

// Check if error is recoverable (should show retry button)
export const isRecoverableError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || '';
    
    // Recoverable errors
    if (status === 429) return true; // Rate limit
    if (status === 500 && message.toLowerCase().includes('high load')) return true;
    if (status === 500 && message.toLowerCase().includes('timeout')) return true;
    
    // Non-recoverable errors
    if (status === 401) return false; // Auth required
    if (status === 403) return false; // Forbidden
    if (status === 404) return false; // Not found
    if (status === 409) return false; // Conflict
  }
  
  // Network errors might be recoverable
  if (error.code === 'ECONNABORTED') return true;
  if (!navigator.onLine) return true;
  
  return false;
};

// Format error for display
export const formatError = (error) => {
  const formattedError = {
    message: getErrorMessage(error),
    severity: getErrorSeverity(error),
    recoverable: isRecoverableError(error),
    originalError: error,
    timestamp: new Date().toISOString()
  };
  
  // Add error type/name for debugging
  if (error.response) {
    formattedError.type = 'API_ERROR';
    formattedError.status = error.response.status;
    formattedError.statusText = error.response.statusText;
    formattedError.serverMessage = error.response.data?.message || error.response.data?.error;
  } else if (error.code === 'ECONNABORTED') {
    formattedError.type = 'TIMEOUT_ERROR';
  } else if (!navigator.onLine) {
    formattedError.type = 'NETWORK_ERROR';
  } else if (error.name) {
    formattedError.type = error.name;
  } else {
    formattedError.type = 'UNKNOWN_ERROR';
  }
  
  return formattedError;
};

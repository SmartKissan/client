// API Endpoints Constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GOOGLE_AUTH: '/auth/google-auth',
    GOOGLE_USER_EXISTS: '/auth/google-user-exists',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    VERIFY_TOKEN: '/auth/verify-token'
  },
  
  // OTP Verification
  OTP: {
    EMAIL_SEND: '/otp/email/send',
    EMAIL_VERIFY: '/otp/email/verify',
    PRE_REGISTER_SEND: '/otp/pre-register/send',
    PRE_REGISTER_VERIFY: '/otp/pre-register/verify',
    AADHAAR_SEND: '/otp/aadhaar/send',
    AADHAAR_VERIFY: '/otp/aadhaar/verify',
    PASSWORD_RESET_SEND: '/otp/password-reset/send',
    PASSWORD_RESET_VERIFY: '/otp/password-reset/verify'
  },
  
  // Profile Management
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile/update'
  }
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER_DATA: 'userData'
};

// Auth Providers
export const AUTH_PROVIDERS = {
  LOCAL: 'LOCAL',
  GOOGLE: 'GOOGLE'
};

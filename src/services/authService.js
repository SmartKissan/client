import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/apiEndpoints';

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  // Google OAuth
  googleAuth: async (googleData) => {
    console.log('authService.googleAuth called with data:', googleData);
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE_AUTH, googleData);
      console.log('Google OAuth response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Google OAuth error in authService:', error);
      console.error('Error response data:', error.response?.data);
      throw error;
    }
  },

  // Check if Google user exists
  checkGoogleUserExists: async (email, googleId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.AUTH.GOOGLE_USER_EXISTS}?email=${encodeURIComponent(email)}&googleId=${encodeURIComponent(googleId)}`);
      return response.data;
    } catch (error) {
      console.error('Error checking Google user exists:', error);
      throw error;
    }
  },

  // Admin login
  adminLogin: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, credentials);
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {});
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
    return response.data;
  }
};

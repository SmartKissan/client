import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const profileService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.PROFILE.GET);
    return response.data;
  },

  // Complete profile
  completeProfile: async (profileData) => {
    const response = await api.post(API_ENDPOINTS.PROFILE.COMPLETE, profileData);
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE, profileData);
    return response.data;
  },

  // Verify Aadhaar
  verifyAadhaar: async (aadhaarData) => {
    const response = await api.post(API_ENDPOINTS.PROFILE.VERIFY_AADHAAR, aadhaarData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete avatar
  deleteAvatar: async () => {
    const response = await api.delete('/profile/avatar');
    return response.data;
  }
};

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const otpService = {
  // Email OTP
  sendEmailOTP: async (email) => {
    const response = await api.post(API_ENDPOINTS.OTP.EMAIL_SEND, { email });
    return response.data;
  },

  verifyEmailOTP: async (email, otp) => {
    const response = await api.post(API_ENDPOINTS.OTP.EMAIL_VERIFY, { email, otp });
    return response.data;
  },

  // Pre-registration Email OTP (for new users)
  sendPreRegisterEmailOTP: async (email) => {
    const response = await api.post(API_ENDPOINTS.OTP.PRE_REGISTER_SEND, { email });
    return response.data;
  },

  verifyPreRegisterEmailOTP: async (email, otp) => {
    const response = await api.post(API_ENDPOINTS.OTP.PRE_REGISTER_VERIFY, { email, otp });
    return response.data;
  },

  // Aadhaar OTP (via Email)
  sendAadhaarOTP: async (aadhaar) => {
    const response = await api.post(API_ENDPOINTS.OTP.AADHAAR_SEND, { aadhaar });
    return response.data;
  },

  verifyAadhaarOTP: async (otp) => {
    const response = await api.post(API_ENDPOINTS.OTP.AADHAAR_VERIFY, { otp });
    return response.data;
  },

  // Password Reset OTP
  sendPasswordResetOTP: async (email) => {
    const response = await api.post(API_ENDPOINTS.OTP.PASSWORD_RESET_SEND, { email });
    return response.data;
  },

  verifyPasswordResetOTPOnly: async (email, otp) => {
    const response = await api.post(`${API_ENDPOINTS.OTP.PASSWORD_RESET_VERIFY}-only`, { email, otp });
    return response.data;
  },

  verifyPasswordResetOTP: async (email, otp, newPassword) => {
    const response = await api.post(API_ENDPOINTS.OTP.PASSWORD_RESET_VERIFY, { 
      email, 
      otp, 
      newPassword 
    });
    return response.data;
  }
};

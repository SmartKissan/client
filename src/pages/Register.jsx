import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { initializeGoogleAuth, renderGoogleButton, signOutGoogle } from '../utils/googleAuth.js';
import { authService } from '../services/authService.js';
import { otpService } from '../services/otpService.js';
import debug from '../utils/debug';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleAuthReady, setGoogleAuthReady] = useState(false);
  
  // Email verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  
  const { register, googleLogin, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Initialize Google OAuth
  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        debug.log('Initializing Google OAuth for Register...');
        await initializeGoogleAuth(handleGoogleSignIn);
        setGoogleAuthReady(true);
        debug.log('Google OAuth initialized successfully');
      } catch (error) {
        debug.error('Failed to initialize Google OAuth:', error);
        toastError('Failed to initialize Google authentication');
      }
    };

    initGoogleAuth();

    // Cleanup on unmount
    return () => {
      signOutGoogle();
    };
  }, [toastError]);

  // Render Google button when ready
  useEffect(() => {
    if (googleAuthReady) {
      setTimeout(() => {
        try {
          renderGoogleButton('google-register-button');
        } catch (error) {
          debug.error('Failed to render Google button:', error);
        }
      }, 100);
    }
  }, [googleAuthReady]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Reset email verification if email changes
    if (e.target.name === 'email') {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp('');
    }
  };

  // Send OTP for email verification
  const handleSendOTP = async () => {
    if (!formData.email) {
      toastError('Please enter an email address');
      return;
    }
    
    setVerifyingEmail(true);
    try {
      await otpService.sendPreRegisterEmailOTP(formData.email);
      setOtpSent(true);
      success('Verification code sent to your email');
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setVerifyingEmail(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      toastError('Please enter the verification code');
      return;
    }
    
    setVerifyingOtp(true);
    try {
      await otpService.verifyPreRegisterEmailOTP(formData.email, otp);
      setEmailVerified(true);
      success('Email verified successfully!');
    } catch (error) {
      toastError(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check email is verified
    if (!emailVerified) {
      toastError('Please verify your email before registering');
      return;
    }
    
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toastError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toastError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In response for registration
  const handleGoogleSignIn = async (response) => {
    debug.log('Google Sign-In response received in Register:', response);
    
    try {
      setGoogleLoading(true);
      
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUserData = {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        picture: payload.picture,
        emailVerified: payload.email_verified
      };
      
      debug.log('Processed Google user data for registration:', { 
        email: googleUserData.email, 
        name: googleUserData.name,
        googleId: googleUserData.googleId,
        picture: googleUserData.picture,
        emailVerified: googleUserData.emailVerified
      });
      
      // Check if user exists
      console.log('Checking if Google user exists for registration...');
      const userCheckResponse = await authService.checkGoogleUserExists(
        googleUserData.email, 
        googleUserData.googleId
      );
      
      console.log('User check response:', userCheckResponse);
      
      if (!userCheckResponse.data.isNewUser) {
        // User already exists - redirect to login
        toastError('An account with this email already exists. Please sign in instead.');
        navigate('/login');
        return;
      }
      
      // New user - show role selection modal
      console.log('New Google user detected, showing role selection');
      const selectedRole = await showRoleSelection();
      
      googleUserData.role = selectedRole;
      
      console.log('New Google user, proceeding with registration...');
      console.log('Sending to backend:', googleUserData);
      const authResponse = await googleLogin(googleUserData);
      
      success('Google account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      debug.error('Google registration error:', error);
      console.error('Full error details:', error);
      console.error('Error response:', error.response);
      toastError(error.response?.data?.message || 'Google registration failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Show role selection modal
  const showRoleSelection = () => {
    return new Promise((resolve) => {
      // Create modal overlay
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modalOverlay.id = 'role-selection-modal';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'bg-white rounded-lg p-6 max-w-md w-full mx-4';
      modalContent.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Your Role</h3>
        <p class="text-sm text-gray-600 mb-4">Choose your role in the Agri-chain platform</p>
        <div class="space-y-3">
          <button class="role-option w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" data-role="farmer">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🌾</span>
              <div>
                <div class="font-medium text-gray-900">Farmer</div>
                <div class="text-sm text-gray-500">Sell crops and manage farm operations</div>
              </div>
            </div>
          </button>
          <button class="role-option w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" data-role="buyer">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🛒</span>
              <div>
                <div class="font-medium text-gray-900">Buyer</div>
                <div class="text-sm text-gray-500">Purchase crops and agricultural products</div>
              </div>
            </div>
          </button>
          <button class="role-option w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-purple-50 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" data-role="logistics">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🚚</span>
              <div>
                <div class="font-medium text-gray-900">Logistics Provider</div>
                <div class="text-sm text-gray-500">Provide transportation and storage services</div>
              </div>
            </div>
          </button>
        </div>
      `;
      
      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);
      
      // Handle role selection
      const handleRoleSelect = (role) => {
        document.body.removeChild(modalOverlay);
        resolve(role);
      };
      
      // Add event listeners
      modalContent.querySelectorAll('.role-option').forEach(button => {
        button.addEventListener('click', () => {
          handleRoleSelect(button.dataset.role);
        });
      });
      
      // Close on overlay click
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          document.body.removeChild(modalOverlay);
          resolve('farmer'); // Default role
        }
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={emailVerified}
                  className={`appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    emailVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={verifyingEmail || !formData.email}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {verifyingEmail ? 'Sending...' : 'Verify Email'}
                  </button>
                )}
                {emailVerified && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-md flex items-center">
                    ✓ Verified
                  </span>
                )}
              </div>
              
              {/* OTP Input Section */}
              {otpSent && !emailVerified && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={verifyingOtp || otp.length !== 6}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {verifyingOtp ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="logistics">Logistics Provider</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or register with</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-center">
                {!googleAuthReady ? (
                  <div className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Loading Google...
                  </div>
                ) : (
                  <div id="google-register-button" className="w-full"></div>
                )}
              </div>
              
              {googleLoading && (
                <div className="mt-2 text-center text-sm text-gray-600">
                  Creating account with Google...
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

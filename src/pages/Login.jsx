import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { initializeGoogleAuth, renderGoogleButton, signOutGoogle } from '../utils/googleAuth.js';
import { authService } from '../services/authService.js';
import debug from '../utils/debug';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleAuthReady, setGoogleAuthReady] = useState(false);
  const { login, googleLogin, error, isAuthenticated } = useAuth();
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
        debug.log('Initializing Google OAuth...');
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
          renderGoogleButton('google-signin-button');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toastError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In response
  const handleGoogleSignIn = async (response) => {
    debug.log('Google Sign-In response received:', response);
    
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
      
      debug.log('Processed Google user data:', { 
        email: googleUserData.email, 
        name: googleUserData.name,
        googleId: googleUserData.googleId,
        picture: googleUserData.picture,
        emailVerified: googleUserData.emailVerified
      });
      
      // Check if user exists
      console.log('Checking if Google user exists...');
      const userCheckResponse = await authService.checkGoogleUserExists(
        googleUserData.email, 
        googleUserData.googleId
      );
      
      console.log('User check response:', userCheckResponse);
      
      let selectedRole;
      if (userCheckResponse.data.isNewUser) {
        // New user - show role selection
        console.log('New Google user detected, showing role selection');
        selectedRole = await showRoleSelection();
      } else {
        // Existing user - use their existing role
        console.log('Existing Google user found, using existing role:', userCheckResponse.data.user.role);
        selectedRole = userCheckResponse.data.user.role;
      }
      
      googleUserData.role = selectedRole;
      
      console.log('Sending to backend:', googleUserData);
      const authResponse = await googleLogin(googleUserData);
      
      // Show appropriate message based on whether it's a new user
      if (authResponse.isNewUser) {
        success('Google account created successfully!');
      } else {
        success('Google login successful!');
      }
      
      navigate('/dashboard');
    } catch (error) {
      debug.error('Google login error:', error);
      console.error('Full error details:', error);
      console.error('Error response:', error.response);
      toastError(error.response?.data?.message || 'Google login failed');
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link 
                to="/reset-password" 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
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
                    <div id="google-signin-button" className="w-full"></div>
                  )}
                </div>
                
                {googleLoading && (
                  <div className="mt-2 text-center text-sm text-gray-600">
                    Authenticating with Google...
                  </div>
                )}
              </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

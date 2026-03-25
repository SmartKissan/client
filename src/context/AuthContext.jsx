import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../constants/apiEndpoints';
import debug from '../utils/debug';

// Auth context initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        try {
          console.log('Verifying stored token...');
          const response = await authService.verifyToken();
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: response.data.user }
          });
          console.log('Token verification successful');
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          dispatch({
            type: AUTH_ACTIONS.SET_LOADING,
            payload: false
          });
        }
      } else {
        console.log('No token found, user not authenticated');
        dispatch({
          type: AUTH_ACTIONS.SET_LOADING,
          payload: false
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    debug.log('Login attempt', { email: credentials.email });
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const response = await authService.login(credentials);
      const { accessToken, refreshToken, user } = response.data;
      
      debug.log('Login successful', { userId: user._id, role: user.role });
      
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user }
      });
      
      return response;
    } catch (error) {
      debug.error('Login failed', error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.response?.data?.message || 'Login failed'
      });
      throw error;
    }
  };

  // Google login function
  const googleLogin = async (googleData) => {
    debug.log('Google login attempt', { 
      email: googleData.email, 
      name: googleData.name,
      googleId: googleData.googleId 
    });
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const response = await authService.googleAuth(googleData);
      const { accessToken, refreshToken, user } = response.data;
      
      debug.log('Google login successful', { 
        userId: user._id, 
        role: user.role,
        provider: user.provider 
      });
      
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user }
      });
      
      return response;
    } catch (error) {
      debug.error('Google login failed', error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.response?.data?.message || 'Google login failed'
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const response = await authService.register(userData);
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user }
      });
      
      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.response?.data?.message || 'Registration failed'
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Update user function
  const setUser = (user) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: user });
  };

  const value = {
    ...state,
    login,
    googleLogin,
    register,
    logout,
    clearError,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

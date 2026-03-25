// Google OAuth utility functions
let isInitialized = false;

// Initialize Google OAuth
export const initializeGoogleAuth = (callback) => {
  return new Promise((resolve, reject) => {
    // Prevent multiple initializations
    if (isInitialized) {
      resolve();
      return;
    }

    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: callback,
          auto_select: false,
          cancel_on_tap_outside: true
        });
        isInitialized = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google OAuth script'));
    };
    
    document.head.appendChild(script);
  });
};

// Handle Google Sign-In response
export const handleGoogleSignIn = (response) => {
  console.log('Google Sign-In response:', response);
  
  if (!response.credential) {
    throw new Error('No credential received from Google');
  }
  
  // Decode the JWT token to get user info
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  
  return {
    email: payload.email,
    name: payload.name,
    googleId: payload.sub,
    picture: payload.picture,
    emailVerified: payload.email_verified
  };
};

// Render Google Sign-In button
export const renderGoogleButton = (buttonId, theme = 'outline', size = 'large') => {
  if (!window.google || !window.google.accounts) {
    console.error('Google OAuth not initialized');
    return;
  }
  
  window.google.accounts.id.renderButton(
    document.getElementById(buttonId),
    {
      theme: theme,
      size: size,
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left'
    }
  );
};

// Sign out from Google
export const signOutGoogle = () => {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.disableAutoSelect();
  }
  isInitialized = false;
};

// Validate Google token
export const validateGoogleToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      throw new Error('Google token has expired');
    }
    
    return {
      isValid: true,
      payload: payload
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
};

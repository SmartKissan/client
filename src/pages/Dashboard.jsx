import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { profileService } from '../services/profileService';

const Dashboard = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setProfileData(response.data.user);
      // Update auth context with fresh data
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    navigate('/login');
  };

  // Use profileData if available, otherwise use user from auth
  const displayUser = profileData || user;

  // Redirect admin users to admin dashboard
  if (displayUser?.role === 'admin') {
    navigate('/admin');
    return null;
  }

  if (!displayUser || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'farmer': return '🌾';
      case 'buyer': return '🛒';
      case 'logistics': return '🚚';
      default: return '👤';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getRoleIcon(displayUser.role)}</span>
              <h1 className="text-xl font-bold text-gray-900">Profile Portal</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 hidden sm:block">{displayUser.email}</span>
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transition-colors"
                title="View Profile"
              >
                {displayUser.avatar ? (
                  <img 
                    src={displayUser.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg">
                    {getRoleIcon(displayUser.role)}
                  </div>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          {/* Card Header with Gradient */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-32"></div>
          
          {/* Avatar & Name */}
          <div className="relative flex items-end -mt-16 mb-4 px-6">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
              {displayUser.avatar ? (
                <img 
                  src={displayUser.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl">
                  {getRoleIcon(displayUser.role)}
                </div>
              )}
            </div>
            <div className="ml-4 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{displayUser.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{displayUser.role}</p>
            </div>
          </div>

          <div className="px-6 pb-6">

          {/* User Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-gray-900">{displayUser.email}</p>
            </div>
            {displayUser.aadhaar && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Aadhaar</p>
                <p className="text-sm font-medium text-gray-900">XXXX-XXXX-{displayUser.aadhaar.slice(-4)}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Account Type</p>
              <p className="text-sm font-medium text-gray-900">{displayUser.provider === 'GOOGLE' ? 'Google Account' : 'Email Account'}</p>
            </div>
          </div>

          {/* Verification Status */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Verification Status</h3>
            <div className="flex flex-wrap gap-3">
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                displayUser.emailVerified 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <span className="mr-1.5">{displayUser.emailVerified ? '✓' : '!'}</span>
                Email {displayUser.emailVerified ? 'Verified' : 'Pending'}
              </div>
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                displayUser.aadhaarVerified 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                <span className="mr-1.5">{displayUser.aadhaarVerified ? '✓' : '○'}</span>
                Aadhaar {displayUser.aadhaarVerified ? 'Verified' : 'Optional'}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            {!displayUser.emailVerified && (
              <button 
                onClick={() => navigate('/verify-email')}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Verify Email
              </button>
            )}
            {!displayUser.aadhaarVerified && (
              <button 
                onClick={() => navigate('/verify-aadhaar')}
                className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                Verify Aadhaar
              </button>
            )}
            <button 
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
            >
              View Full Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

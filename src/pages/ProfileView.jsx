import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { profileService } from '../services/profileService';

const ProfileView = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showLargeImage, setShowLargeImage] = useState(false);
  const avatarMenuRef = useRef(null);

  // Auto-clear error when success shows
  useEffect(() => {
    if (success) {
      setError('');
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  // Close avatar menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await profileService.getProfile();
      setProfileData(response.data.user);
      setFormData(response.data.user);
    } catch (error) {
      setError('Failed to fetch profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await profileService.updateProfile(formData);
      setError(''); // Clear any error
      setSuccess('Profile updated successfully!');
      setProfileData(response.data.user);
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      setSuccess(''); // Clear success on error
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    setSuccess('');

    try {
      const response = await profileService.uploadAvatar(file);
      setError(''); // Clear any error
      setSuccess('Profile image uploaded successfully!');
      setProfileData(prev => ({ ...prev, avatar: response.data.avatar }));
      setUser(prev => ({ ...prev, avatar: response.data.avatar }));
    } catch (error) {
      setSuccess(''); // Clear success on error
      setError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async () => {
    if (!confirm('Are you sure you want to remove your profile image?')) return;

    setUploadingImage(true);
    setError('');
    setSuccess('');

    try {
      await profileService.deleteAvatar();
      setError(''); // Clear any error
      setSuccess('Profile image removed successfully!');
      setProfileData(prev => ({ ...prev, avatar: '' }));
      setUser(prev => ({ ...prev, avatar: '' }));
    } catch (error) {
      setSuccess(''); // Clear success on error
      setError(error.response?.data?.message || 'Failed to remove image');
    } finally {
      setUploadingImage(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'farmer': return '🌾';
      case 'buyer': return '🛒';
      case 'logistics': return '🚚';
      case 'admin': return '👨‍💼';
      default: return '👤';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAadhaar = (aadhaar) => {
    if (!aadhaar) return '';
    const digits = aadhaar.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-indigo-600 hover:text-indigo-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl = profileData.avatar 
    ? (profileData.avatar.startsWith('http') ? profileData.avatar : `http://localhost:8080${profileData.avatar}`)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar with floating menu */}
              <div className="relative" ref={avatarMenuRef}>
                <div 
                  onClick={() => !uploadingImage && setShowAvatarMenu(!showAvatarMenu)}
                  className={`cursor-pointer relative group ${uploadingImage ? 'pointer-events-none' : ''}`}
                >
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className={`w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ${uploadingImage ? 'opacity-50' : 'group-hover:opacity-90'} transition-opacity`}
                    />
                  ) : (
                    <div className={`w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl border-4 border-white shadow-lg ${uploadingImage ? 'opacity-50' : 'group-hover:bg-gray-50'} transition-colors`}>
                      {getRoleIcon(profileData.role)}
                    </div>
                  )}
                  {/* Loading Spinner */}
                  {uploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  )}
                  {/* Overlay hint */}
                  {!uploadingImage && (
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">Edit</span>
                    </div>
                  )}
                </div>
                
                {/* Floating Menu */}
                {showAvatarMenu && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    {avatarUrl && (
                      <button
                        onClick={() => {
                          setShowLargeImage(true);
                          setShowAvatarMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Profile
                      </button>
                    )}
                    <label 
                      htmlFor="avatar-upload" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Update Profile
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageUpload(e);
                        setShowAvatarMenu(false);
                      }}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    {avatarUrl && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            handleImageDelete();
                            setShowAvatarMenu(false);
                          }}
                          disabled={uploadingImage}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove Profile
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left text-white">
                <h1 className="text-2xl font-bold">{profileData.name}</h1>
                <p className="text-indigo-100 capitalize">{profileData.role}</p>
                <p className="text-indigo-200 text-sm">{profileData.email}</p>
              </div>

              <div className="sm:ml-auto flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-50"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Error/Success Messages - Only show one at a time */}
            {success ? (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                {success}
              </div>
            ) : error ? (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>👤</span> Personal Information
                </h3>
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{profileData.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Email</label>
                      <p className="text-sm font-medium text-gray-900">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="9876543210"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{profileData.phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth?.split('T')[0] || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{formatDate(profileData.dateOfBirth)}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 capitalize">{profileData.gender || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase">Aadhaar Number</label>
                    <p className="text-sm font-medium text-gray-900">
                      {profileData.aadhaar ? formatAadhaar(profileData.aadhaar) : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📍</span> Address Information
                </h3>
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Street Address</label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        rows={2}
                        value={formData.address || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{profileData.address || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{profileData.city || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="state"
                          value={formData.state || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{profileData.state || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase">PIN Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                          maxLength={6}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{profileData.pincode || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>✓</span> Verification Status
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                  profileData.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <span>{profileData.emailVerified ? '✓' : '!'}</span>
                  <span>Email {profileData.emailVerified ? 'Verified' : 'Pending'}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                  profileData.aadhaarVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <span>{profileData.aadhaarVerified ? '✓' : '○'}</span>
                  <span>Aadhaar {profileData.aadhaarVerified ? 'Verified' : 'Optional'}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                {!profileData.emailVerified && (
                  <button
                    onClick={() => navigate('/verify-email')}
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-md text-sm font-medium hover:bg-green-50"
                  >
                    Verify Email
                  </button>
                )}
                {!profileData.aadhaarVerified && (
                  <button
                    onClick={() => navigate('/verify-aadhaar')}
                    className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md text-sm font-medium hover:bg-purple-50"
                  >
                    Verify Aadhaar
                  </button>
                )}
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Large Image Modal */}
      {showLargeImage && avatarUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLargeImage(false)}
        >
          <div className="relative">
            <img 
              src={avatarUrl} 
              alt="Profile Large" 
              className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full object-cover border-4 border-white shadow-2xl"
            />
            <button
              onClick={() => setShowLargeImage(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;

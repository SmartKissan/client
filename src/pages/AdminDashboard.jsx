import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { profileService } from '../services/profileService';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Fetch users and stats
      const [usersRes, statsRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8080/api/v1/admin/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      if (usersData.success) {
        setUsers(usersData.data.users);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err) {
      toastError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'buyer': return 'bg-blue-100 text-blue-800';
      case 'logistics': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Access denied. Admins only.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Admin Header */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">👨‍💼</span>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Portal</h1>
                <p className="text-xs text-gray-400">AgrChain Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">{user.email}</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-lg">
                👨‍💼
              </div>
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
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
              <p className="text-blue-200 text-xs mt-2">+{stats.newUsersToday} today</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Verified Users</p>
                  <p className="text-3xl font-bold">{stats.verifiedUsers}</p>
                </div>
                <div className="text-4xl">✓</div>
              </div>
              <p className="text-green-200 text-xs mt-2">
                {Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% of total
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Pending</p>
                  <p className="text-3xl font-bold">{stats.pendingVerification}</p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
              <p className="text-yellow-200 text-xs mt-2">Need verification</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Role Types</p>
                  <p className="text-3xl font-bold">
                    {Object.keys(stats.roleDistribution).length}
                  </p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
              <p className="text-purple-200 text-xs mt-2">Active categories</p>
            </div>
          </div>
        )}

        {/* Role Distribution */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Role Distribution</h3>
              <div className="space-y-4">
                {Object.entries(stats.roleDistribution).map(([role, count]) => (
                  <div key={role} className="flex items-center">
                    <span className="w-24 text-sm capitalize">{getRoleIcon(role)} {role}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            role === 'farmer' ? 'bg-green-500' :
                            role === 'buyer' ? 'bg-blue-500' :
                            role === 'logistics' ? 'bg-purple-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(count / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-sm">✉️ Email Verified</span>
                  <span className="text-lg font-bold text-green-400">
                    {stats.verificationStats.emailVerified}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-sm">🆔 Aadhaar Verified</span>
                  <span className="text-lg font-bold text-blue-400">
                    {stats.verificationStats.aadhaarVerified}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-sm">✅ Fully Verified</span>
                  <span className="text-lg font-bold text-purple-400">
                    {stats.verificationStats.fullyVerified}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold">All Users ({users.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg mr-3">
                          {userItem.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{userItem.name}</p>
                          <p className="text-xs text-gray-400">{userItem.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(userItem.role)}`}>
                        {getRoleIcon(userItem.role)} {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {userItem.emailVerified && (
                          <span className="text-xs text-green-400">✓ Email</span>
                        )}
                        {userItem.aadhaarVerified && (
                          <span className="text-xs text-blue-400">✓ Aadhaar</span>
                        )}
                        {!userItem.emailVerified && !userItem.aadhaarVerified && (
                          <span className="text-xs text-yellow-400">⏳ Pending</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/profile/${userItem._id}`)}
                        className="text-indigo-400 hover:text-indigo-300 text-sm"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

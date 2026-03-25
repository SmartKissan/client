import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// Simple role-based access control component
const RoleBasedUI = ({ children, allowedRoles, fallback = null }) => {
  const { user } = useAuth();

  if (!user) {
    return fallback || null;
  }

  const hasAccess = allowedRoles.includes(user.role);
  
  if (!hasAccess) {
    return fallback || null;
  }

  return children;
};

// Role badge component for display
export const RoleBadge = ({ role }) => {
  const roleConfig = {
    farmer: { icon: '🌾', color: 'bg-green-100 text-green-800' },
    buyer: { icon: '🛒', color: 'bg-orange-100 text-orange-800' },
    logistics: { icon: '🚚', color: 'bg-cyan-100 text-cyan-800' },
    admin: { icon: '👨‍💼', color: 'bg-red-100 text-red-800' }
  };

  const config = roleConfig[role] || { icon: '👤', color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <span>{config.icon}</span>
      <span className="capitalize">{role}</span>
    </span>
  );
};

export default RoleBasedUI;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, logout, validateToken } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate token with backend on mount
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const result = await validateToken();
        if (result.valid) {
          setUser(getCurrentUser());
        } else {
          // Token is invalid, clear everything and redirect to login
          logout();
          setUser(null);
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?error=session_expired';
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isHR = () => {
    return user && (user.role === 'hr' || user.role === 'admin');
  };

  const isManager = () => {
    return user && ['admin', 'hr', 'manager'].includes(user.role);
  };

  const isHROrManager = () => {
    return user && ['admin', 'hr', 'manager'].includes(user.role);
  };

  const value = {
    user,
    loading,
    loginUser,
    logoutUser,
    isAuthenticated: !!user,
    isAdmin,
    isHR,
    isManager,
    isHROrManager
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

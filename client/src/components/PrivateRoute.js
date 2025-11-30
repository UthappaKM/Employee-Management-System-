import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false, managerOnly = false, hrOnly = false }) => {
  const { isAuthenticated, isAdmin, isManager, isHR, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  if (managerOnly && !isManager()) {
    return <Navigate to="/dashboard" />;
  }

  if (hrOnly && !isHR() && !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;

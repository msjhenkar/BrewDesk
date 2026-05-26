import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → redirect to their own dashboard
  if (role && user.role !== role) {
    const redirect = user.role === 'ADMIN' ? '/menu' : '/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default ProtectedRoute;

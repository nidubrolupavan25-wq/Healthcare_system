import React from 'react';
import { Navigate } from 'react-router-dom';

const SuperAdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');
  
  console.log("SuperAdminProtectedRoute check:", { token, userEmail, userRole });

  if (!token && !userEmail) {
    return <Navigate to="/" replace />;
  }

  // Normalize role for comparison
  const normalizedRole = userRole?.toLowerCase().trim() || '';
  
  // Check for super admin roles
  const isSuperAdmin = [
    'super admin', 
    'super_admin', 
    'superadmin',
    'superadministrator',
    'super administrator'
  ].includes(normalizedRole);
  
  console.log("Is Super Admin:", isSuperAdmin);

  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default SuperAdminProtectedRoute;
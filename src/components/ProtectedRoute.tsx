
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['administrator', 'recruiter', 'candidate', 'sme', 'university_spoc'] 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // You could replace this with a loading spinner
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle legacy roles
  let actualRole = user.role;
  if (user.role === 'hr') actualRole = 'recruiter';
  if (user.role === 'student') actualRole = 'candidate';
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(actualRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

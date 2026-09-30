import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <div className="animate-pulse text-lg font-mono">Authenticating...</div>
      </div>
    );
  }

  // Ensure user is logged in and is an admin
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/problems" replace />;
  }

  return children;
}

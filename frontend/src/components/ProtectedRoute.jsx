import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--paper)',
        color: 'var(--ink)'
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
          Loading session...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

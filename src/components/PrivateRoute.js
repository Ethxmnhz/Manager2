// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const PrivateRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;

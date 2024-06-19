import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ component }) => {
  const { accessToken } = useContext(AuthContext);

  return accessToken ? component : <Navigate to="/login" replace />;
};

export default ProtectedRoute;



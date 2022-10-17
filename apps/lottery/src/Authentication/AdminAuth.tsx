import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminAuth = ({ children }: { children: JSX.Element }) => {
  const userType = localStorage.getItem('userType');
  if (userType === 'Admin') {
    // console.log('Trying to render Admin auth..');
    return children;
  }
  if (userType === 'User') {
    return <Navigate to="/dashboard" />;
  }
  return <Navigate to="/login" />;
};

export default AdminAuth;

import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicAuth = ({ children }: { children: JSX.Element }) => {
  const userType = localStorage.getItem('userType');
  if (userType === 'LoggedOut') {
    console.log('in public routes and returning children');
    return children;
  }

  if (userType === 'Admin') {
    console.log('redirecting to Admin.......');
    return <Navigate to="/adminDashboard/ticket" />;
  }
  console.log('redirecting to User.......');
  return <Navigate to="/dashboard" />;
};

export default PublicAuth;

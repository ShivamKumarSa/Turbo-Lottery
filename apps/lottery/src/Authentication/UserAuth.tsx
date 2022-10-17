import React from 'react';
import { Navigate } from 'react-router-dom';

const UserAuth = ({ children }: { children: JSX.Element }) => {
  const userType = localStorage.getItem('userType');
  if (userType === 'User') {
    console.log('Trying to render User auth..');
    return children;
  }
  if (userType === 'Admin') {
    return <Navigate to="/adminDashboard/ticket" />;
  }
  return <Navigate to="/" />;
};

export default UserAuth;

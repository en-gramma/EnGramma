import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const PrivateRoute = ({ roles }) => {
  const { currentUser } = useContext(AuthContext);

  // If the user is not logged in, store the current route in sessionStorage
  if (!currentUser) {
    sessionStorage.setItem('redirectPath', window.location.pathname);
    return <Navigate to="/login" />;
  }

  // Check if the user has the required role
  const hasAllowedRole = roles.includes(currentUser.role);

  // If the user doesn't have the required role, redirect to a different route
  if (!hasAllowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  // If the user is logged in and has the required role, render the protected route
  return <Outlet />;
};
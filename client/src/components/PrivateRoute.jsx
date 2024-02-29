import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const PrivateRoute = ({ roles }) => {
  const { currentUser } = useContext(AuthContext);

//page de redirection si l'utilisateur n'est pas connecté
  if (!currentUser) {
    sessionStorage.setItem('redirectPath', window.location.pathname);
    return <Navigate to="/admin476" />;
  }

  const hasAllowedRole = roles.includes(currentUser.role);


  if (!hasAllowedRole) {
    return <Navigate to="/unauthorized" />;
  }
  return <Outlet />;
};
// src/context/UserContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRut, setUserRut] = useState(() => localStorage.getItem('userRut') || null);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || null);

  const handleLogin = (rut, role) => {
    setUserRut(rut);
    setUserRole(role);
    localStorage.setItem('userRut', rut);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setUserRut(null);
    setUserRole(null);
    localStorage.removeItem('userRut');
    localStorage.removeItem('userRole');
    localStorage.clear();
  };

  return (
    <UserContext.Provider value={{ userRut, userRole, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

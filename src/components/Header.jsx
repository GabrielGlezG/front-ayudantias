// src/components/Header.js
import React, { useContext, useState } from 'react';
import logoNew from '../utils/images/logoNew.png';
import avatar from '../utils/images/avatar.png';
import '../styles/Header.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userRut, userRole, handleLogout } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <header className="header">
      {/* Logo */}
      <img src={logoNew} alt="Logo" className="header-logo" />

      {/* Información del usuario */}
      <div className="header-user position-relative">
        {/* Avatar */}
        <img
          src={avatar}
          alt="Avatar"
          onClick={toggleMenu}
          className="header-avatar"
        />

        {/* Texto al lado del avatar */}
        <div className="d-flex flex-column align-items-center ms-2">
          <span className="header-rut">{userRut || 'Cargando...'}</span>
          <div className="header-role">{userRole || 'Cargando...'}</div>
        </div>

        {/* Menú desplegable */}
        {isMenuOpen && (
          <div className="dropdown-menu show">
            <button
              className="dropdown-item text"
              onClick={handleLogoutAndRedirect}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

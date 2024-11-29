import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authService'; // Importa la función de autenticación
import '../styles/Login.css';
import logo from '../utils/images/logoNew.png';
import { UserContext } from '../context/UserContext';
import { fetchAyudantes } from '../api/getAyudantes';

const Login = () => {
  const [rut, setRut] = useState('');
  const [rol, setRol] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { handleLogin } = useContext(UserContext); // Obtener la función de login

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rol) {
      setError('Por favor selecciona un rol.');
      return;
    }

    try {
      const { Usuario } = await loginUser(rut, rol);
      const ayudantes = await fetchAyudantes();
      const esAyudante = ayudantes.some((ayudante) => ayudante.estudiante.rut === rut);
    
      if (rol === 'c' && esAyudante) {
        setError('No puedes acceder como estudiante, ya que estás registrado como ayudante.');
        return;
      }

      if (rol === 'c') {
        handleLogin(rut, 'Estudiante');
        navigate(`/postulation/${Usuario}`);
      } else if (rol === 'a') {
        handleLogin(rut, 'Director');
        navigate(`/selection/${Usuario}`);
      } if (rol === 'd') {
        handleLogin(rut, 'Ayudante');
        navigate(`/reports/${Usuario}`);
      } if (rol === 'b') {
        handleLogin(rut, 'Coordinador');
        navigate(`/Coordinator/${Usuario}`);
      }
      else {
        setError('Rol seleccionado no válido o sin permisos para acceder.');
      }
    } catch (err) {
      setError(err.message || 'Error en la autenticación. Intenta nuevamente más tarde.');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-card shadow-lg p-5">
        <img src={logo} alt="Logo" className="logo mb-4" />
        <h2 className="text-center mb-4">Plataforma de Gestión Académica Ayudantías</h2>
        <h6 className="text-center mb-4">Por favor ingresa con tus credenciales de Pasaporte.UTEM.</h6>
        <form onSubmit={handleLoginSubmit} className="w-100">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={rut}
              placeholder="Ingresa tu RUT"
              onChange={(e) => setRut(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <option value="">Selecciona el tipo de usuario</option>
              <option value="c">Estudiante</option>
              <option value="a">Director</option>
              <option value="b">Coordinador</option>
              <option value="d">Ayudante</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Iniciar Sesión
          </button>
        </form>
        {error && <p className="text-danger text-center mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default Login;

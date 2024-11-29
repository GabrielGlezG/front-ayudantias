// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Postulation from './pages/Postulation';
import Selection from './pages/Selection'; // Importa el componente para el director
import Reports from './pages/Reports';
import { UserProvider, UserContext } from './context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './styles/global.css'; 
import CoordinatorPage from './pages/CoordinatorPage';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <HeaderWrapper /> {/* Componente para el Header */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/postulation/:userId" element={<Postulation />} />
          <Route path="/selection/:userId" element={<Selection />} /> {/* Nueva ruta para el director */}
          <Route path="/Reports/:userId" element={<Reports />} /> {/* Nueva ruta para el ayudante */}
          <Route path="/Coordinator/:userId" element={<CoordinatorPage />} /> {/* Nueva ruta para el coordinador */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

const HeaderWrapper = () => {
  const { userRut, userRole } = useContext(UserContext); // Accede al contexto para obtener el rol
  return userRut ? <Header role={userRole} /> : null; // Mostrar el Header solo si el usuario está autenticado
};

export default App;

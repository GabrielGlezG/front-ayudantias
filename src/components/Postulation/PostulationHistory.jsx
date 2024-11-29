import React, { useState, useEffect } from 'react';
import { fetchPostulaciones } from '../../api/directorService';
import 'bootstrap/dist/css/bootstrap.min.css';

const PostulationHistory = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postulaciones, setPostulaciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPostulaciones = async () => {
      if (!isOpen) return; // Solo cargar cuando el modal esté abierto
      
      setLoading(true);
      try {
        // Asegurarse de que userId es un número
        const userIdNum = parseInt(userId, 10);
        
        console.log('Consultando postulaciones para usuario:', userIdNum);
        
        const response = await fetchPostulaciones(1, 10); // Removido userId del fetch si el API devuelve todas las postulaciones
        console.log('Respuesta completa del servidor:', response);

        if (!response || !response.body || !response.body.Postulaciones) {
          throw new Error('Formato de respuesta inválido');
        }

        const { body: { Postulaciones } } = response;

        // Buscar las postulaciones específicas del usuario
        const userPostulacion = Postulaciones.find(
          (postulacion) => postulacion.usuario_id === userIdNum
        );

        console.log('Postulaciones encontradas para el usuario:', userPostulacion);

        if (userPostulacion && userPostulacion.materias) {
          setPostulaciones(userPostulacion.materias);
        } else {
          setPostulaciones([]);
        }
      } catch (err) {
        console.error('Error detallado:', err);
        setError('No se pudo cargar el historial de postulaciones.');
        setPostulaciones([]);
      } finally {
        setLoading(false);
      }
    };

    loadPostulaciones();
  }, [userId, isOpen]); // Agregado isOpen como dependencia

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setError(null); // Limpiar errores anteriores al abrir
    }
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="4" className="text-center">Cargando postulaciones...</td>
        </tr>
      );
    }

    if (postulaciones.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center">No tienes postulaciones registradas.</td>
        </tr>
      );
    }

    return postulaciones.map((materia, index) => (
      <tr key={`${materia.id_postulacion || index}-${index}`}>
        <td>{materia.materia?.codigo || materia.materia?.id || 'N/A'}</td>
        <td>{materia.materia?.nombre || 'N/A'}</td>
        <td>{materia.materia?.departamento?.nombre || `Departamento ${materia.materia?.id_departamento}` || 'N/A'}</td>
        <td>{materia.nota ? materia.nota.toFixed(2) : 'N/A'}</td>
      </tr>
    ));
  };

  return (
    <div className="postulation-history">
      <button
        className="btn btn-primary"
        style={{ backgroundColor: '#2DD69C', color: 'white' }}
        onClick={toggleMenu}
      >
        Historial de Postulaciones
      </button>

      {isOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="modal-header">
                <h5 className="modal-title text-center" style={{ flex: 1 }}>
                  HISTORIAL DE POSTULACIONES
                </h5>
              </div>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Asignatura</th>
                      <th>Departamento</th>
                      <th>Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTableContent()}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={toggleMenu}
                  disabled={loading}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostulationHistory;
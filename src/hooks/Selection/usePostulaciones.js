import { useState, useEffect } from 'react';
import { fetchPostulaciones } from '../../api/directorService';
import { fetchEstudiante } from '../../api/DataEstudiante';

export const usePostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState({});
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const getPostulaciones = async () => {
    try {
      const response = await fetchPostulaciones(1, 1000);
      const postulacionesData = response.body?.Postulaciones || response.Postulaciones || [];
      const estudiantesData = {};

      for (const postulacion of postulacionesData) {
        const usuarioId = postulacion.usuario_id;
        if (!estudiantesData[usuarioId]) {
          const estudiante = await fetchEstudiante(usuarioId);
          estudiantesData[usuarioId] = estudiante;
        }
      }

      setPostulaciones(postulacionesData);
      setEstudiantes(estudiantesData);
      setTotalPages(Math.ceil(postulacionesData.length / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Error al cargar postulaciones:', err);
      setError(err.message || 'Error desconocido al cargar postulaciones');
    }
  };

  useEffect(() => {
    getPostulaciones();
  }, []);

  return {
    postulaciones,
    setPostulaciones,
    estudiantes,
    error,
    totalPages
  };
};
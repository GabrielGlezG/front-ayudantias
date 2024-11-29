import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchPostulaciones } from '../api/directorService';
import { enviarPostulaciones } from '../api/PostulantesService';
import PostulationMenu from '../components/Postulation/PostulationMenu';
import PostulationHistory from '../components/Postulation/PostulationHistory';
import Filter from '../components/Filter';
import { fetchMateriasAprobadas } from '../api/materiasService';
import CustomSelect from '../components/Postulation/CustomSelect';
import Pagination from '../components/Pagination';

const MAX_POSTULACIONES = 3;
const ITEMS_PER_PAGE = 5;

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (valueToStore?.length > 0) {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

const useToast = () => {
  const notify = useCallback((message, type = 'success') => {
    toast[type](message, { position: 'top-center', autoClose: 3000 });
  }, []);

  return {
    notifySuccess: (message) => notify(message),
    notifyError: (message) => notify(message, 'error')
  };
};

const Postulation = () => {
  const { userId } = useParams();
  const [materias, setMaterias] = useState([]);
  const [postulaciones, setPostulaciones] = useLocalStorage(`postulaciones_${userId}`, []);
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState('TODO');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDisabled, setIsDisabled] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('Cargando...');
  const { notifySuccess, notifyError } = useToast();

  const loadUserPostulaciones = useCallback(async () => {
    try {
      const responseData = await fetchPostulaciones(currentPage, ITEMS_PER_PAGE);
      const { Postulaciones = [] } = responseData.body || {};

      const currentUserId = parseInt(userId, 10);
      const userPostulacion = Postulaciones.find(
        (postulacion) => postulacion.usuario_id === currentUserId
      );

      setIsDisabled(userPostulacion?.materias?.length > 0);
    } catch (err) {
      console.error('Error al verificar postulaciones:', err);
      setError(`Error al verificar postulaciones: ${err.message}`);
      setIsDisabled(false);
      setLoadingMessage('Error al cargar');
    }
  }, [userId, currentPage]);

  const loadMaterias = useCallback(async () => {
    if (isDisabled) return;

    try {
      const result = await fetchMateriasAprobadas(userId, currentPage, ITEMS_PER_PAGE);
      setMaterias(result.materias || []);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error('Error al obtener materias:', err);
      setError(`Error al obtener materias: ${err.message}`);
    }
  }, [userId, currentPage, isDisabled]);

  useEffect(() => {
    loadUserPostulaciones();
  }, [loadUserPostulaciones]);

  useEffect(() => {
    loadMaterias();
  }, [loadMaterias]);

  const handlePostular = useCallback((materia) => {
    if (postulaciones.length >= MAX_POSTULACIONES) {
      notifyError(`Solo puedes postular a un máximo de ${MAX_POSTULACIONES} asignaturas.`);
      return;
    }

    if (postulaciones.some((p) => p.id_materia_usuario_nota === materia.id_materia_usuario_nota)) {
      notifyError(`Ya te has postulado a la asignatura: ${materia.nombre} (${materia.codigo})`);
      return;
    }

    setPostulaciones([...postulaciones, materia]);
    notifySuccess(`Asignatura ${materia.nombre} (${materia.codigo}) agregada correctamente`);
  }, [postulaciones, setPostulaciones, notifySuccess, notifyError]);

  const handleRemovePostulacion = useCallback((id_materia_usuario_nota) => {
    setPostulaciones(prev => prev.filter(p => p.id_materia_usuario_nota !== id_materia_usuario_nota));
    notifySuccess('Asignatura eliminada correctamente.');
  }, [setPostulaciones, notifySuccess]);

  const handleEnviarPostulaciones = async () => {
    const materiaUN = postulaciones.map(p => p.id_materia_usuario_nota);

    if (materiaUN.length === 0) {
      notifyError('No hay postulaciones válidas para enviar.');
      return;
    }

    try {
      await enviarPostulaciones(materiaUN);
      notifySuccess('Postulaciones enviadas correctamente.');
      setPostulaciones([]);
      setIsDisabled(true);
      setMaterias([]);
    } catch (error) {
      notifyError('Error al enviar postulaciones. Intenta nuevamente.');
      setError(error.message);
    }
  };

  const filteredMaterias = useMemo(() => {
    return materias.filter((materia) => {
      const searchText = filterText.toLowerCase();
      switch (filterType) {
        case 'RUT':
          return materia.rut?.toLowerCase().includes(searchText);
        case 'CODIGO':
          return materia.codigo.toLowerCase().includes(searchText);
        case 'DEPARTAMENTO':
          return materia.departamento.nombre.toLowerCase().includes(searchText);
        default:
          return (
            materia.nombre.toLowerCase().includes(searchText) ||
            materia.codigo.toLowerCase().includes(searchText) ||
            materia.departamento.nombre.toLowerCase().includes(searchText)
          );
      }
    });
  }, [materias, filterText, filterType]);

  if (isDisabled === null) {
    return (
      <div className="container mt-5 text-center">
        <p>{loadingMessage}</p>
        {error && <p className="text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">INSCRIPCIÓN AYUDANTÍAS</h2>
      {error && <p className="text-danger">{error}</p>}

      <div
        className="d-flex align-items-center mb-2"
        style={{
          gap: '10px',
          paddingTop: '10px', // Espaciado superior
        }}
      >
        {/* Campo de búsqueda */}
        <Filter filterText={filterText} setFilterText={setFilterText} />

        {/* Componente CustomSelect */}
        <CustomSelect
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          options={[
            { value: 'TODO', label: 'MOSTRAR TODO' },
            { value: 'CODIGO', label: 'FILTRAR POR CÓDIGO ASIGNATURA' },
            { value: 'DEPARTAMENTO', label: 'FILTRAR POR DEPARTAMENTO' },
          ]}
        />

        {/* Postulation Menu or History */}
        <div className="ms-auto">
          {isDisabled ? (
            <PostulationHistory userId={userId} />
          ) : (
            <PostulationMenu
              postulaciones={postulaciones}
              handleEnviar={handleEnviarPostulaciones}
              handleRemovePostulacion={handleRemovePostulacion}
            />
          )}
        </div>
      </div>


      {!isDisabled && (
        <>
          <table className="table table-hover table-sm" style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #dee2e6' }}>
            <thead className="table-light">
              <tr>
                <th className="text-center">Código</th>
                <th className="text-center">Asignatura</th>
                <th className="text-center">Departamento</th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterias.map((materia) => (
                <tr key={materia.id_materia_usuario_nota}>
                  <td className="text-center">{materia.codigo}</td>
                  <td className="text-center">{materia.nombre}</td>
                  <td className="text-center">{materia.departamento.nombre}</td>
                  <td className="text-center">
                    <i
                      className="bi bi-plus-circle"
                      style={{ fontSize: '1.5rem', cursor: 'pointer', color: '#2DD69C' }}
                      onClick={() => handlePostular(materia)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-end mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)} // Actualiza la página actual
            />
          </div>
        </>
      )}

      {isDisabled && (
        <p className="text-center text-danger">
          Ya has enviado tu postulación. No puedes realizar más postulaciones.
        </p>
      )}
    </div>
  );
};

export default Postulation;
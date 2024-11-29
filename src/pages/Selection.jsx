// pages/Selection.jsx
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchPostulaciones } from '../api/directorService';
import { fetchEstudiante } from '../api/DataEstudiante';
import { interactuarPostulacion } from '../api/InteractuarPostulacionService';
import Pagination from '../components/Pagination';
import TableHeader from '../components/Selection/TableHeader';
import PostulacionRow from '../components/Selection/PostulacionRow';
import FilterControls from '../components/Selection/FilterControls';
import ModalConfirmacion from '../components/Selection/ModalConfimacion';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ITEMS_PER_PAGE = 1;
const USED_SECTIONS_KEY = 'usedSections';
const PERMANENT_SECTIONS_KEY = 'permanentSections';

const Selection = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState({});
  const [filterText, setFilterText] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [assignedSections, setAssignedSections] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [assignedSectionsByCourse, setAssignedSectionsByCourse] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Using custom hook for localStorage
  const [usedSections, setUsedSections] = useLocalStorage(USED_SECTIONS_KEY, {});
  const [permanentSections, setPermanentSections] = useLocalStorage(PERMANENT_SECTIONS_KEY, {});

  useEffect(() => {
    localStorage.removeItem(USED_SECTIONS_KEY);
  }, []);

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

  const openModal = (titulo, mensaje, onConfirm) => {
    setModalData({ titulo, mensaje, onConfirm });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const notifySuccess = (message) => {
    toast.success(message, { position: 'top-center', autoClose: 3000 });
  };

  const notifyError = (message) => {
    toast.error(message, { position: 'top-center', autoClose: 3000 });
  };

  const handleAccept = (idPostulacion, materiaId) => {
    const seccionAsignada = assignedSections[materiaId];

    if (!seccionAsignada) {
      notifyError('Debe asignar una sección antes de aceptar.');
      return;
    }

    // Validar que la sección no esté en permanentSections al aceptar
    if (permanentSections[seccionAsignada.id]) {
      notifyError('Esta sección ya ha sido asignada permanentemente.');
      return;
    }

    openModal(
      'Confirmar Aceptación',
      '¿Está seguro de aceptar esta postulación?',
      async () => {
        setIsProcessing(true);
        try {
          await interactuarPostulacion({
            id: idPostulacion,
            estado: true,
            id_seccion: seccionAsignada.id,
          });

          // Guardar la sección en permanentSections
          setPermanentSections((prev) => ({
            ...prev,
            [seccionAsignada.id]: {
              id: seccionAsignada.id,
              number: seccionAsignada.number,
              timestamp: new Date().toISOString(),
            },
          }));

          notifySuccess('Postulación aceptada exitosamente.');

          // Actualizar postulaciones
          setPostulaciones((prev) =>
            prev
              .map((postulacion) => ({
                ...postulacion,
                materias: postulacion.materias.filter(
                  (materia) => materia.id_postulacion !== idPostulacion
                ),
              }))
              .filter((postulacion) => postulacion.materias.length > 0)
          );
        } catch (err) {
          console.error('Error al aceptar la postulación:', err.message);
          notifyError('Error al aceptar la postulación. Intente nuevamente.');
        } finally {
          setIsProcessing(false);
          closeModal();
        }
      }
    );
  };

  const handleReject = (idPostulacion) => {
    openModal(
      'Confirmar Rechazo',
      '¿Está seguro de rechazar esta postulación?',
      async () => {
        setIsProcessing(true);
        try {
          await interactuarPostulacion({
            id: idPostulacion,
            estado: false,
            id_seccion: null,
          });
          notifySuccess('Postulación rechazada exitosamente.');
          updatePostulaciones(idPostulacion);
        } catch (err) {
          console.error('Error al rechazar la postulación:', err.message);
          notifyError('Error al rechazar la postulación. Intente nuevamente.');
        } finally {
          setIsProcessing(false);
          closeModal();
        }
      }
    );
  };

  const updatePostulaciones = (idPostulacion) => {
    setPostulaciones((prev) =>
      prev.map(postulacion => ({
        ...postulacion,
        materias: postulacion.materias.filter(materia =>
          materia.id_postulacion !== idPostulacion
        )
      })).filter(postulacion => postulacion.materias.length > 0)
    );
  };

  const handleAssignSection = (materiaId, materiaCodigo, seccion) => {
    // Validar si la sección ya está asignada a la materia (para evitar redundancias en el estado)
    if (assignedSections[materiaId]?.id === seccion.id) {
      return; // Ya está asignada, no hacemos nada
    }

    // Asignar temporalmente la sección a la materia
    setAssignedSections((prev) => ({
      ...prev,
      [materiaId]: seccion, // Asigna la sección seleccionada a la materia correspondiente
    }));

    setAssignedSections((prev) => ({
      ...prev,
      [materiaId]: seccion,
    }));

    setUsedSections((prev) => ({
      ...prev,
      [seccion.id]: {
        id: seccion.id,
        number: seccion.number,
        timestamp: new Date().toISOString(),
      },
    }));

    setAssignedSectionsByCourse((prev) => ({
      ...prev,
      [materiaCodigo]: [seccion.id],
    }));
  };

  // const handlePreviousPage = () => {
  //   if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  // };

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  // };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filterPostulaciones = () => {
    return postulaciones.filter((postulacion) => {
      const estudiante = estudiantes[postulacion.usuario_id];
      if (!estudiante) return false;

      switch (filterOption) {
        case 'rut':
          return estudiante.rut?.toLowerCase().includes(filterText.toLowerCase());
        case 'codigo':
          return postulacion.materias.some((materia) =>
            String(materia.materia.id)?.toLowerCase().includes(filterText.toLowerCase())
          );
        case 'departamento':
          return postulacion.materias.some((materia) =>
            materia.materia.id_departamento?.toString().toLowerCase().includes(filterText.toLowerCase())
          );
        default:
          return true;
      }
    });
  };

  const globalFilteredPostulaciones = filterPostulaciones();
  const paginatedPostulaciones = globalFilteredPostulaciones.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mt-5">
      <ToastContainer />
      <ModalConfirmacion
        isOpen={isModalOpen}
        onClose={closeModal}
        titulo={modalData?.titulo}
        mensaje={modalData?.mensaje}
        onConfirm={modalData?.onConfirm}
        isProcessing={isProcessing}
      />

      <h2 className="text-center">ESTUDIANTES POSTULADOS</h2>
      {error && <p className="text-danger">{error}</p>}

      <FilterControls
        filterText={filterText}
        setFilterText={setFilterText}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
        filteredPostulaciones={globalFilteredPostulaciones}
        estudiantes={estudiantes}
      />

      {paginatedPostulaciones.length > 0 ? (
        <table className="table table-hover text-center">
          <TableHeader />
          <tbody>
            {paginatedPostulaciones.map((postulacion, index) => (
              <PostulacionRow
                key={postulacion.usuario_id}
                postulacion={postulacion}
                estudiante={estudiantes[postulacion.usuario_id] || {}}
                index={index}
                currentPage={currentPage}
                ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                assignedSectionsByCourse={assignedSectionsByCourse}
                handleAssignSection={handleAssignSection}
                handleAccept={handleAccept}
                handleReject={handleReject}
                isProcessing={isProcessing}
                usedSections={usedSections}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay postulaciones disponibles.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(globalFilteredPostulaciones.length / ITEMS_PER_PAGE)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Selection;
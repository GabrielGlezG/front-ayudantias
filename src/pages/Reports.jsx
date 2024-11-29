import React, { useState, useEffect } from 'react';
import { fetchAyudantes } from '../api/getAyudantes'; // Fetch del endpoint api/v1/ayudantes
import ReportModal from '../components/Reports/ReportModal'; // Importa el nuevo componente
import Pagination from '../components/Pagination'; // Importa el componente de paginación
import FilterWithSelect from '../components/Reports/FilterWithSelect'; // Importa el nuevo componente
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { enviarReporte } from '../api/postReporte';

const AyudantePage = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [selectedAsignatura, setSelectedAsignatura] = useState(null);

  // Estados para el filtro
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState('TODO'); // Filtro por tipo

  // Estados para la paginación
  const ITEMS_PER_PAGE = 3; // Número de asignaturas por página
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const obtenerAsignaturas = async () => {
      try {
        const storedRut = localStorage.getItem('userRut');
        if (!storedRut) {
          throw new Error('No se encontró el RUT del usuario en el almacenamiento.');
        }

        const ayudantes = await fetchAyudantes();
        if (!ayudantes || !Array.isArray(ayudantes)) {
          throw new Error('Error en la estructura de respuesta de la API.');
        }

        const asignaturasData = ayudantes
          .filter((a) => a.estudiante.rut === storedRut)
          .map((a) => ({
            id_ayudante: a.id,
            id_seccion: a.seccion.id,
            id: a.seccion.materia.id,
            codigo: a.seccion.codigo,
            nombre: a.seccion.materia.nombre,
            departamentoId: a.seccion.materia.id_departamento,
            seccion: a.seccion.codigo,
          }));

        if (asignaturasData.length === 0) {
          throw new Error('No se encontraron asignaturas para este ayudante.');
        }

        setAsignaturas(asignaturasData);
      } catch (err) {
        console.error('Error al obtener asignaturas:', err);
        setError(err.message || 'Error al obtener asignaturas.');
        toast.error(err.message || 'Error al obtener asignaturas.');
      } finally {
        setLoading(false);
      }
    };

    obtenerAsignaturas();
  }, []);

  const handleCardClick = (asignatura) => {
    if (asignatura) {
      setSelectedAsignatura(asignatura);
      setShowModal(true);
    } else {
      toast.error('No se puede abrir el reporte para una asignatura no válida.');
    }
  };

  const handleSaveReporte = async (reporte) => {
    try {
      if (!selectedAsignatura) {
        throw new Error('No se seleccionó ninguna asignatura.');
      }

      const id_ayudante = selectedAsignatura.id_ayudante;
      const id_seccion = selectedAsignatura.id_seccion;

      if (!id_ayudante || !id_seccion) {
        throw new Error('Faltan datos necesarios para enviar el reporte.');
      }

      await enviarReporte({
        id_ayudante,
        id_seccion,
        contenido: reporte,
      });

      toast.success('Reporte enviado exitosamente.');
      setSelectedAsignatura(null);
      setShowModal(false);
    } catch (error) {
      toast.error('Error al enviar el reporte.');
      console.error('Error:', error);
    }
  };

  const filteredAsignaturas = asignaturas.filter((asignatura) => {
    const searchText = filterText.toLowerCase();
    switch (filterType) {
      case 'CODIGO':
        return (
          asignatura.codigo &&
          asignatura.codigo.toString().toLowerCase().includes(searchText)
        );
      case 'NOMBRE':
        return (
          asignatura.nombre &&
          asignatura.nombre.toLowerCase().includes(searchText)
        );
      default:
        return (
          (asignatura.nombre &&
            asignatura.nombre.toLowerCase().includes(searchText)) ||
          (asignatura.codigo &&
            asignatura.codigo.toString().toLowerCase().includes(searchText))
        );
    }
  });


  const totalPages = Math.ceil(filteredAsignaturas.length / ITEMS_PER_PAGE);
  const paginatedAsignaturas = filteredAsignaturas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <p>Cargando asignaturas...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Mis Ayudantías</h2>

      {/* Componente de Filtro con Select */}
      <div className="mt-4">
        <FilterWithSelect
          filterText={filterText}
          setFilterText={setFilterText}
          filterType={filterType}
          setFilterType={setFilterType}
        />
      </div>

      <div className="row">
        {paginatedAsignaturas.map((asignatura) => (
          <div
            className="col-md-4 mb-4"
            key={asignatura.id}
            onClick={() => handleCardClick(asignatura)}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="card shadow-sm h-100"
              style={{ transition: 'transform 0.2s', border: '1px solid #ddd' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <h5 className="card-title text-center fw-bold">
                  {asignatura.nombre.toUpperCase()}
                </h5>
                <p className="card-text text-center text-muted">
                  <strong>Sección:</strong> {asignatura.seccion}
                </p>
                <p className="card-text text-center text-muted">
                  <strong>Código:</strong> {asignatura.codigo}
                </p>
                <i
                  className="bi bi-file-earmark-text"
                  style={{
                    fontSize: '2rem',
                    color: '#6c63ff',
                  }}
                ></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Componente de paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Modal para reporte */}
      {selectedAsignatura && (
        <ReportModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          handleSave={handleSaveReporte}
          asignaturaNombre={selectedAsignatura.nombre}
          asignaturaSeccion={selectedAsignatura.seccion}
        />
      )}
    </div>
  );
};

export default AyudantePage;

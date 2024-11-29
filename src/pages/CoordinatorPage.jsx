import React, { useEffect, useState } from 'react';
import { fetchAyudantes } from '../api/getAyudantes';
import { fetchReportesBySeccion } from '../api/fetchReportes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AyudanteTable from '../components/Coordinator/AyudanteTable';
import Pagination from '../components/Pagination'; // Importa el componente de paginación
import AyudanteFilterControls from '../components/Coordinator/AyudanteFilterControls';

const CoordinadorPage = () => {
  const [ayudantes, setAyudantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [filterText, setFilterText] = useState('');
  const [filterOption, setFilterOption] = useState('');

  // Estados para la paginación
  const ITEMS_PER_PAGE = 1; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const obtenerAyudantes = async () => {
      try {
        const data = await fetchAyudantes();

        // Agrupar las asignaturas por usuario
        const groupedData = [];
        for (const ayudante of data) {
          const { nombre, rut } = ayudante.estudiante;
          const asignatura = {
            asignatura: ayudante.seccion.materia.nombre,
            seccion: ayudante.seccion.codigo,
            id_seccion: ayudante.seccion.id,
            id: ayudante.seccion.materia.id,
            codigo: ayudante.seccion.codigo,
            departamentoId: ayudante.seccion.materia.id_departamento,
            tieneReportes: false, // Inicialmente sin reportes
          };

          // Verificar si hay reportes para esta sección
          try {
            const reportes = await fetchReportesBySeccion(ayudante.seccion.id);
            if (reportes.length > 0) {
              asignatura.tieneReportes = true;
            }
          } catch (err) {
            console.error(`Error al verificar reportes para la sección ${ayudante.seccion.id}`, err);
          }

          // Buscar si ya existe el ayudante
          const existing = groupedData.find((item) => item.rut === rut);
          if (existing) {
            existing.asignaturas.push(asignatura);
          } else {
            groupedData.push({
              nombre,
              rut,
              asignaturas: [asignatura],
            });
          }
        }

        setAyudantes(groupedData);
      } catch (err) {
        setError(err.message || 'Error al cargar los ayudantes.');
        toast.error(err.message || 'Error al cargar los ayudantes.');
      } finally {
        setLoading(false);
      }
    };

    obtenerAyudantes();
  }, []);

  const filteredAyudantes = ayudantes.filter((ayudante) => {
    const searchText = filterText.toLowerCase();

    switch (filterOption) {
      case 'rut':
        return (
          ayudante.rut &&
          ayudante.rut.toLowerCase().includes(searchText)
        );
      case 'seccion':
        return ayudante.asignaturas.some((asignatura) =>
          asignatura.seccion.toString().toLowerCase().includes(searchText)
        );
      case 'departamento':
        return ayudante.asignaturas.some((asignatura) =>
          asignatura.departamentoId.toString().toLowerCase().includes(searchText)
        );
      default:
        return true; // Mostrar todos si no hay filtro
    }
  });

  // Calcular la paginación
  const totalPages = Math.ceil(filteredAyudantes.length / ITEMS_PER_PAGE);
  const paginatedAyudantes = filteredAyudantes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Cargando ayudantes...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Lista de Ayudantes</h2>

      {/* Componente de filtros y exportación */}
      <AyudanteFilterControls
        filterText={filterText}
        setFilterText={setFilterText}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
        ayudantes={filteredAyudantes}
      />

      {/* Tabla con los ayudantes paginados */}
      <AyudanteTable ayudantes={paginatedAyudantes} />

      {/* Componente de paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default CoordinadorPage;

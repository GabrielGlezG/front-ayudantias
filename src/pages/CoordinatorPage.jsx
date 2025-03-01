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
        const ayudantes = await fetchAyudantes(); // 🔹 Ahora obtenemos el array directamente
        
        console.log("Ayudantes recibidos:", ayudantes); // ✅ Verificamos que estamos recibiendo datos
    
        if (!Array.isArray(ayudantes) || ayudantes.length === 0) {
          throw new Error("No hay ayudantes disponibles.");
        }
    
        const groupedData = [];
    
        for (const ayudante of ayudantes) { // 🔹 Recorremos directamente `ayudantes`
          const { id, estudiante, seccion } = ayudante; // 📌 `id` es el ID correcto del ayudante
          if (!id || !estudiante || !seccion) continue;
    
          const asignatura = {
            asignatura: seccion.materia.nombre,
            seccion: seccion.codigo,
            id_seccion: seccion.id,
            id: seccion.materia.id,
            departamentoId: seccion.materia.id_departamento,
            tieneReportes: false,
          };
    
          try {
            const reportes = await fetchReportesBySeccion(seccion.id);
            if (reportes.length > 0) {
              asignatura.tieneReportes = true;
            }
          } catch (err) {
            console.error(`Error al verificar reportes para la sección ${seccion.id}`, err);
          }
    
          // 📌 Nos aseguramos de pasar el `id_ayudante` correcto
          const existing = groupedData.find((item) => item.rut === estudiante.rut);
          if (existing) {
            existing.asignaturas.push(asignatura);
          } else {
            groupedData.push({
              id_ayudante: id, // ✅ `id` es el ID del ayudante, no del estudiante
              nombre: estudiante.nombre,
              rut: estudiante.rut,
              asignaturas: [asignatura],
            });
          }
        }
    
        setAyudantes(groupedData);
      } catch (err) {
        console.error("Error al cargar ayudantes:", err);
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

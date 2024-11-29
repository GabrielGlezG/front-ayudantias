import React, { useState, useEffect } from 'react';
import { fetchSecciones } from '../../api/SeccionesService';
import { fetchAyudantes } from '../../api/getAyudantes';

const AssignSectionButton = ({ materiaCodigo, materiaId, assignedSections, onSectionAssign }) => {
  const [secciones, setSecciones] = useState([]);
  const [ayudantesSecciones, setAyudantesSecciones] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Carga las secciones ocupadas por ayudantes al montar el componente
    const loadAyudantesSecciones = async () => {
      try {
        const ayudantes = await fetchAyudantes();
        const ocupadas = {};
        ayudantes.forEach((ayudante) => {
          const materiaId = ayudante.seccion.materia.id;
          const seccionId = ayudante.seccion.id;
          if (!ocupadas[materiaId]) {
            ocupadas[materiaId] = new Set();
          }
          ocupadas[materiaId].add(seccionId);
        });
        setAyudantesSecciones(ocupadas);
      } catch (err) {
        console.error('Error al cargar las secciones asignadas a ayudantes:', err);
        setError('Error al cargar las secciones asignadas.');
      }
    };

    loadAyudantesSecciones();
  }, []);

  const handleFetchSecciones = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }
    try {
      const seccionesData = await fetchSecciones(materiaCodigo);
      if (seccionesData) {
        // Filtrar las secciones asignadas a ayudantes y las ya seleccionadas
        const seccionesOcupadas = ayudantesSecciones[materiaCodigo] || new Set();
        const availableSecciones = seccionesData.filter(
          (seccion) =>
            !assignedSections.includes(seccion.id) && !seccionesOcupadas.has(seccion.id)
        );
        setSecciones(availableSecciones);
        setIsExpanded(true);
      } else {
        setError('No hay secciones disponibles.');
      }
    } catch (err) {
      console.error('Error al cargar secciones:', err);
      setError('Error al cargar secciones.');
    }
  };

  const handleSelectSection = (seccion) => {
    setSelectedSection(seccion);
    onSectionAssign(seccion);
    setIsExpanded(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="btn btn-outline-info btn-sm d-flex align-items-center"
        onClick={handleFetchSecciones}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#000',
          fontWeight: 'bold',
        }}
      >
        {selectedSection ? `Sección: ${selectedSection.codigo}` : 'Asignar Sección'}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="#2DD69C"
          className={`ms-2 bi bi-caret-${isExpanded ? 'up-fill' : 'down-fill'}`}
          viewBox="0 0 16 16"
        >
          <path
            d={
              isExpanded
                ? 'M7.247 4.86l-4.796 5.481c-.566.646-.106 1.659.753 1.659h9.592c.86 0 1.32-1.013.753-1.659L8.753 4.86a1 1 0 0 0-1.506 0z'
                : 'M7.247 11.14l-4.796-5.481c-.566-.646-.106-1.659.753-1.659h9.592c.86 0 1.32-1.013.753-1.659L8.753 11.14a1 1 0 0 1-1.506 0z'
            }
          />
        </svg>
      </button>

      {error && <p className="text-danger mt-1">{error}</p>}

      {isExpanded && (
        <ul
          className="list-group position-absolute mt-2 shadow"
          style={{
            zIndex: 10,
            width: '100%',
            borderRadius: '5px',
          }}
        >
          {secciones.length > 0 ? (
            secciones.map((seccion) => (
              <li
                key={seccion.id}
                className="list-group-item list-group-item-action text-center"
                style={{
                  cursor: 'pointer',
                  color: '#000',
                  backgroundColor: '#FFFFFF',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2DD69C';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.color = '#000';
                }}
                onClick={() => handleSelectSection(seccion)}
              >
                {seccion.codigo}
              </li>
            ))
          ) : (
            <li className="list-group-item text-center">No hay secciones disponibles.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AssignSectionButton;

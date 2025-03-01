import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Tabs, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { fetchEvaluationsByHelper } from '../../api/getEvaluations';
import { fetchAyudantes } from '../../api/getAyudantes';

const ViewAllEvaluationsButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allAyudantes, setAllAyudantes] = useState([]);
  const [ayudantesEvaluations, setAyudantesEvaluations] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [ayudantesWithEvals, setAyudantesWithEvals] = useState([]);
  
  // Color principal para diseño
  const primaryColor = '#FFA500'; // Color naranja

  useEffect(() => {
    const loadAyudantes = async () => {
      try {
        const ayudantes = await fetchAyudantes();
        setAllAyudantes(ayudantes);
      } catch (error) {
        console.error('Error al obtener la lista de ayudantes:', error);
        toast.error('Error al cargar la lista de ayudantes');
      }
    };

    loadAyudantes();
  }, []);

  const handleFetchAllEvaluations = async () => {
    try {
      setLoading(true);
      
      // Crear un objeto para almacenar las evaluaciones de cada ayudante
      const evaluationsData = {};
      
      // Obtener evaluaciones para cada ayudante
      await Promise.all(
        allAyudantes.map(async (ayudante) => {
          try {
            const data = await fetchEvaluationsByHelper(ayudante.id);
            if (data && data.length > 0) {
              evaluationsData[ayudante.id] = data;
            }
          } catch (error) {
            console.error(`Error al obtener evaluaciones para ${ayudante.estudiante.nombre}:`, error);
          }
        })
      );
      
      setAyudantesEvaluations(evaluationsData);
      
      // Filtrar solo ayudantes con evaluaciones
      const ayudantesWithEvaluations = allAyudantes.filter(
        ayudante => evaluationsData[ayudante.id] && evaluationsData[ayudante.id].length > 0
      );
      
      setAyudantesWithEvals(ayudantesWithEvaluations);
      
      // Establecer la primera pestaña activa si hay ayudantes con evaluaciones
      if (ayudantesWithEvaluations.length > 0) {
        setActiveTab(ayudantesWithEvaluations[0].id);
      }
    } catch (error) {
      toast.error('Error al obtener las evaluaciones. Intenta nuevamente.');
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  const renderAyudanteEvaluations = (ayudanteId) => {
    const ayudante = allAyudantes.find(a => a.id === ayudanteId);
    const evaluations = ayudantesEvaluations[ayudanteId] || [];

    return (
      <div>
        {ayudante && (
          <div className="mb-3 p-3 rounded" style={{ backgroundColor: `${primaryColor}20` }}>
            <h5>{ayudante.estudiante.nombre}</h5>
            <strong>RUT:</strong> {ayudante.estudiante.rut} <br />
            {ayudante.seccion && (
              <>
                <strong>Sección:</strong> {ayudante.seccion.codigo} <br />
                <strong>Materia:</strong> {ayudante.seccion.materia?.nombre || 'No especificada'} <br />
              </>
            )}
          </div>
        )}

        {evaluations.length > 0 ? (
          <ul className="list-group">
            {evaluations.map((evaluation, index) => {
              // Buscar información de la sección
              const section = ayudante?.seccion?.id === evaluation.id_section ? 
                ayudante.seccion : 
                allAyudantes.find(a => a.seccion?.id === evaluation.id_section)?.seccion;

              return (
                <li key={index} className="list-group-item" style={{ borderLeft: `4px solid ${evaluation.value === 1 ? '#28a745' : '#dc3545'}` }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>Asignatura:</strong> {section?.materia?.nombre || 'Desconocida'} <br />
                      <strong>Sección:</strong> {section?.codigo || 'Desconocida'} <br />
                      <strong>Comentario:</strong> {evaluation.content}
                    </div>
                    <span 
                      className="badge p-2" 
                      style={{ 
                        backgroundColor: evaluation.value === 1 ? '#28a745' : '#dc3545',
                        color: 'white' 
                      }}
                    >
                      {evaluation.value === 1 ? '👍 Positiva' : '👎 Negativa'}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-muted">No hay evaluaciones disponibles para este ayudante.</p>
        )}
      </div>
    );
  };

  return (
    <>
      <button
        className="btn"
        onClick={handleFetchAllEvaluations}
        style={{ 
          fontSize: '0.85rem', 
          padding: '6px 12px', 
          borderRadius: '8px', 
          backgroundColor: primaryColor, 
          border: 'none', 
          color: '#fff' 
        }}
      >
        Evaluaciones de Ayudantes
      </button>

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        size="lg"
      >
        <Modal.Header closeButton style={{ borderBottom: `3px solid ${primaryColor}` }}>
          <Modal.Title>Evaluaciones de Ayudantes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status" style={{ color: primaryColor }} />
              <p className="mt-3">Cargando evaluaciones de ayudantes...</p>
            </div>
          ) : ayudantesWithEvals.length > 0 ? (
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
              style={{ 
                '--bs-nav-tabs-link-active-color': primaryColor,
                '--bs-nav-tabs-link-active-border-color': `${primaryColor} ${primaryColor} #fff` 
              }}
            >
              {ayudantesWithEvals.map(ayudante => (
                <Tab 
                  key={ayudante.id} 
                  eventKey={ayudante.id} 
                  title={
                    <div>
                      {ayudante.estudiante.nombre.split(' ')[0]}
                      {ayudantesEvaluations[ayudante.id]?.length > 0 && (
                        <span className="badge ms-1" style={{ backgroundColor: primaryColor }}>{ayudantesEvaluations[ayudante.id].length}</span>
                      )}
                    </div>
                  }
                >
                  {renderAyudanteEvaluations(ayudante.id)}
                </Tab>
              ))}
            </Tabs>
          ) : (
            <p className="text-center text-muted">No hay evaluaciones registradas para ningún ayudante.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn" 
            onClick={() => setShowModal(false)}
            style={{ backgroundColor: '#6c757d', color: 'white' }}
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewAllEvaluationsButton;
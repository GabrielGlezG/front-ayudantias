import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { fetchReportesBySeccion } from '../../api/fetchReportes';
import Pagination from '../Pagination'; // Usa tu componente de paginación

const ViewReportsButton = ({ idSeccion, asignatura }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3; // Número de reportes por página

  const handleFetchReportes = async () => {
    try {
      setLoading(true);
      const reportesData = await fetchReportesBySeccion(idSeccion);
      setReportes(reportesData);
    } catch (error) {
      toast.error(error.message || 'Error al obtener reportes. Intenta nuevamente.');
      setReportes([]);
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  const paginatedReportes = reportes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {/* Botón estilizado */}
      <button
        className="btn d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: '#2DD69C',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          padding: '8px 12px',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          transition: '0.3s',
        }}
        onClick={handleFetchReportes}
      >
        <i className="bi bi-eye" style={{ marginRight: '8px' }}></i> Ver Reportes
      </button>

      {/* Modal para mostrar los reportes */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#2DD69C', fontWeight: 'bold' }}>REPORTES</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h5 className="text-dark fw-bold">{asignatura}</h5>
            <p className="text-secondary">
              Sección <span className="fw-bold">{idSeccion}</span>
            </p>
          </div>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
              <p className="mt-3">Cargando reportes...</p>
            </div>
          ) : reportes.length > 0 ? (
            <div>
              {paginatedReportes.map((reporte) => (
                <div
                  key={reporte.id}
                  className="p-3 mb-3"
                  style={{
                    borderRadius: '12px',
                    background: '#f9f9f9',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className="d-flex align-items-center mb-2">
                    <i
                      className="bi bi-calendar-event"
                      style={{
                        fontSize: '1.5rem',
                        color: '#2DD69C',
                        marginRight: '10px',
                      }}
                    ></i>
                    <p className="mb-0 fw-bold">
                      {new Date(reporte.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-muted mb-0">{reporte.contenido}</p>
                </div>
              ))}
              {/* Paginación */}
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(reportes.length / ITEMS_PER_PAGE)}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          ) : (
            <p className="text-center text-muted">No hay reportes disponibles para esta sección.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
            style={{
              borderRadius: '10px',
              padding: '8px 12px',
              fontWeight: 'bold',
            }}
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewReportsButton;

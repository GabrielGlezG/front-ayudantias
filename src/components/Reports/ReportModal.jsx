import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ReportModal = ({ show, handleClose, handleSave, asignaturaNombre, asignaturaSeccion }) => {
  const [reporte, setReporte] = useState('');

  const handleSubmit = () => {
    if (reporte.trim()) {
      handleSave(reporte);
      setReporte(''); // Limpia el textarea después de guardar
      handleClose();
    } else {
      toast.error('Por favor, escriba un reporte antes de enviarlo.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton style={{ borderBottom: 'none' }}>
        <Modal.Title style={{ color: '#6c757d', fontWeight: 'bold' }}>INGRESE SU REPORTE</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label className="fw-semibold" style={{ color: '#6c757d' }}>
              Asignatura: <span className="fw-bold">{asignaturaNombre}</span>
            </Form.Label>
            <Form.Label className="fw-semibold d-block mt-2" style={{ color: '#6c757d' }}>
              Sección: <span className="fw-bold">{asignaturaSeccion}</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Escriba su reporte aquí"
              value={reporte}
              onChange={(e) => setReporte(e.target.value)}
              className="p-3 mt-3"
              style={{
                borderRadius: '10px',
                fontSize: '1rem',
                border: '1px solid #ced4da',
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleSubmit}
          className="w-100"
          style={{
            backgroundColor: '#2DD69C',
            color: '#fff',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 0',
          }}
        >
          Enviar Reporte
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportModal;

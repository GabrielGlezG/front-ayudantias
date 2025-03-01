import React, { useState } from 'react';
import { Modal, Spinner, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { submitEvaluation } from '../../api/evaluationService';

const EvaluateHelperButton = ({ idSeccion, idAyudante }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [comment, setComment] = useState('');

  const handleEvaluationSubmit = async () => {
    if (value === null) {
      toast.error('Por favor, selecciona una evaluación positiva o negativa.');
      return;
    }

    if (!idAyudante) {
      toast.error('Error: ID del ayudante no encontrado.');
      console.error('Error: idAyudante está vacío o no definido. Valor recibido:', idAyudante);
      return;
    }

    const evaluationData = {
      value,
      content: comment,
      id_section: idSeccion,
      id_helper: idAyudante,
    };

    console.log("Enviando evaluación:", evaluationData);

    try {
      setLoading(true);
      await submitEvaluation(evaluationData);
      toast.success('Evaluación enviada con éxito.');
      setShowModal(false);
      setValue(null);
      setComment('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn"
        onClick={() => setShowModal(true)}
        style={{ 
          marginLeft: '5px', 
          borderRadius: '8px', 
          padding: '5px 10px', 
          fontWeight: 'bold', 
          fontSize: '0.85rem',
          backgroundColor: '#FC9C1B', 
          color: '#fff'
        }}
      >
        Evaluar
      </button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Evaluar Ayudante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
          </Form>
          <div className="d-flex justify-content-center mt-3 gap-3">
            <button
              className={`btn ${value === 1 ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setValue(1)}
              style={{ 
                fontSize: '1.5rem', 
                padding: '8px 12px', 
                transition: '0.3s',
                backgroundColor: value === 1 ? '#FC9C1B' : 'transparent',
                color: value === 1 ? '#fff' : '',
                borderColor: '#FC9C1B'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#FDB863'}
              onMouseLeave={(e) => e.target.style.backgroundColor = value === 1 ? '#FC9C1B' : 'transparent'}
            >
              <i className="bi bi-hand-thumbs-up"></i>
            </button>
            <button
              className={`btn ${value === 0 ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setValue(0)}
              style={{ 
                fontSize: '1.5rem', 
                padding: '8px 12px', 
                transition: '0.3s',
                backgroundColor: value === 0 ? '#FC9C1B' : 'transparent',
                color: value === 0 ? '#fff' : '',
                borderColor: '#FC9C1B'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#FDB863'}
              onMouseLeave={(e) => e.target.style.backgroundColor = value === 0 ? '#FC9C1B' : 'transparent'}
            >
              <i className="bi bi-hand-thumbs-down"></i>
            </button>
          </div>
          {loading && <Spinner animation="border" role="status" className="mt-3" />}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '5px 10px' }} onClick={() => setShowModal(false)}>
            Cerrar
          </button>
          <button className="btn btn-success" style={{ fontSize: '0.85rem', padding: '5px 10px' }} onClick={handleEvaluationSubmit}>
            Enviar Evaluación
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EvaluateHelperButton;

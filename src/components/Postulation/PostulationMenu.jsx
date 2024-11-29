import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../styles/PostulationMenu.css';

const ItemType = 'POSTULACION';

const PostulacionItem = ({ materia, index, movePostulacion, handleRemove }) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.index !== index) {
        movePostulacion(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <tr
      ref={(node) => ref(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      <td>{index + 1}</td>
      <td>{materia.nombre} ({materia.codigo})</td>
      <td className="text-center">
        <button
          className="btn text-danger"
          onClick={() => handleRemove(materia.id_materia_usuario_nota)}
        >
          <i className="bi bi-x-circle" style={{ fontSize: '1rem' }}></i>
        </button>
      </td>
    </tr>
  );
};

const PostulationMenu = ({ postulaciones, handleEnviar, handleRemovePostulacion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priorityList, setPriorityList] = useState([]);

  useEffect(() => {
    setPriorityList(postulaciones);
  }, [postulaciones]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const movePostulacion = (fromIndex, toIndex) => {
    const updatedList = [...priorityList];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setPriorityList(updatedList);
  };

  const handleRemove = (id_materia_usuario_nota) => {
    const updatedList = priorityList.filter((p) => p.id_materia_usuario_nota !== id_materia_usuario_nota);
    setPriorityList(updatedList);
    handleRemovePostulacion(id_materia_usuario_nota); // Notificar al componente padre
  };

  const handleSendPostulaciones = () => {
    handleEnviar(priorityList);
    toggleMenu();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="postulation-menu">
        <button className="btn btn-secondary" style={{ backgroundColor: '#2DD69C' }} onClick={toggleMenu}>
          Mis Postulaciones
        </button>

        {isOpen && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="modal-header">
                  <h5 className="modal-title text-center" style={{ flex: 1 }}>SELECCIÓN DE PRIORIDAD</h5>
                </div>
                <div className="modal-body">
                  <div className="mb-3 d-flex align-items-center">
                    <i
                      className="bi bi-arrows-move me-2"
                      style={{ fontSize: '1.5rem', color: '#2DD69C' }}
                      title="Puedes arrastrar las asignaturas"
                    ></i>
                    <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                      Arrastra las asignaturas para ordenar su prioridad.
                    </span>
                  </div>
                  {priorityList.length > 0 ? (
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Prioridad</th>
                          <th>Asignatura</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {priorityList.map((materia, index) => (
                          <PostulacionItem
                            key={materia.id_materia_usuario_nota}
                            materia={materia}
                            index={index}
                            movePostulacion={movePostulacion}
                            handleRemove={handleRemove}
                          />
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No has postulado a ninguna asignatura.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    style={{ backgroundColor: '#2DD69C', color: 'white' }}
                    onClick={handleSendPostulaciones}
                  >
                    Enviar Postulaciones
                  </button>
                  <button className="btn btn-secondary" onClick={toggleMenu}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default PostulationMenu;

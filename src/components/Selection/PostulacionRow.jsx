import React from 'react';
import  AssignSectionButton  from '../Selection/AssignSectionButton';  // Ajusta la ruta
import  ActionButtons  from '../Selection/ActionButtons';  // Ajusta la ruta

const PostulacionRow = ({
  postulacion,
  estudiante,
  index,
  currentPage,
  ITEMS_PER_PAGE,
  assignedSectionsByCourse,
  handleAssignSection,
  handleAccept,
  handleReject,
  isProcessing,
  usedSections
}) => (
  <React.Fragment>
    {postulacion.materias.map((materia, materiaIndex) => (
      <tr
        key={materia.id}
        style={
          materiaIndex === postulacion.materias.length - 1
            ? { borderBottom: '3px solid #dee2e6' }
            : null
        }
      >
        {materiaIndex === 0 && (
          <>
            <td rowSpan={postulacion.materias.length}>
              {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
            </td>
            <td rowSpan={postulacion.materias.length}>
              {estudiante.nombre || 'Cargando...'}
            </td>
            <td rowSpan={postulacion.materias.length}>
              {estudiante.rut || 'Cargando...'}
            </td>
          </>
        )}
        <td>{materia.materia.id}</td>
        <td>{materia.materia.nombre}</td>
        <td>{materia.materia.id_departamento}</td>
        <td>{materia.nota?.toFixed(2) || 'Sin nota'}</td>
        <td>
          <AssignSectionButton
            materiaCodigo={materia.materia.id}
            materiaId={materia.id}
            assignedSections={assignedSectionsByCourse[materia.materia.id] || []}
            onSectionAssign={(seccion) =>
              handleAssignSection(materia.id, materia.materia.id, seccion)
            }
            usedSections={usedSections}
          />
        </td>
        <td>
          <ActionButtons
            onAccept={() => handleAccept(materia.id_postulacion, materia.id)}
            onReject={() => handleReject(materia.id_postulacion)}
            isProcessing={isProcessing}
          />
        </td>
      </tr>
    ))}
  </React.Fragment>
);

export default PostulacionRow;
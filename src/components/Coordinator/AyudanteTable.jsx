import React from 'react';
import ViewReportsButton from './ViewReportsButton';

const AyudanteTable = ({ ayudantes }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>N°</th>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Asignatura</th>
            <th>Sección</th>
            <th>Reportes</th>
          </tr>
        </thead>
        <tbody>
          {ayudantes.map((ayudante, index) => (
            <React.Fragment key={index}>
              {ayudante.asignaturas.map((asignatura, idx) => (
                <tr key={`${index}-${idx}`}>
                  {idx === 0 && (
                    <>
                      <td rowSpan={ayudante.asignaturas.length}>{index + 1}</td>
                      <td rowSpan={ayudante.asignaturas.length}>{ayudante.nombre}</td>
                      <td rowSpan={ayudante.asignaturas.length}>{ayudante.rut}</td>
                    </>
                  )}
                  <td>{asignatura.asignatura}</td>
                  <td>Sección {asignatura.seccion}</td>
                  <td>
                    {asignatura.tieneReportes ? (
                      <ViewReportsButton
                        idSeccion={asignatura.id_seccion}
                        asignatura={asignatura.asignatura}
                      />
                    ) : (
                      <span className="text-muted">Sin reportes</span>
                    )}
                  </td>
                </tr>
              ))}
              {/* Fila de separación */}
              <tr className="table-separator" style={{ backgroundColor: '#f8f9fa' }}>
                <td colSpan="6" style={{ height: '10px' }}></td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AyudanteTable;

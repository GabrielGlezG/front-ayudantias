import React from 'react';
import ViewReportsButton from './ViewReportsButton';
import EvaluateHelperButton from './EvaluateHelperButton'; // Importamos el botón de evaluación

const AyudanteTable = ({ ayudantes }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ width: '5%' }}>N°</th>
            <th style={{ width: '20%' }}>Nombre</th>
            <th style={{ width: '15%' }}>RUT</th>
            <th style={{ width: '20%' }}>Asignatura</th>
            <th style={{ width: '15%' }}>Sección</th>
            <th style={{ width: '25%' }} className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ayudantes.map((ayudante, index) => (
            <React.Fragment key={index}>
              {ayudante.asignaturas.map((asignatura, idx) => (
                <tr key={`${index}-${idx}`}>
                  {idx === 0 && (
                    <>
                      <td rowSpan={ayudante.asignaturas.length} className="align-middle text-center">
                        {index + 1}
                      </td>
                      <td rowSpan={ayudante.asignaturas.length} className="align-middle">
                        {ayudante.nombre}
                      </td>
                      <td rowSpan={ayudante.asignaturas.length} className="align-middle">
                        {ayudante.rut}
                      </td>
                    </>
                  )}
                  <td className="align-middle">{asignatura.asignatura}</td>
                  <td className="align-middle">Sección {asignatura.seccion}</td>
                  <td className="align-middle">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      {asignatura.tieneReportes ? (
                        <ViewReportsButton
                          idSeccion={asignatura.id_seccion}
                          asignatura={asignatura.asignatura}
                        />
                      ) : (
                        <span className="text-muted">Sin reportes</span>
                      )}
                      <EvaluateHelperButton
                        idSeccion={asignatura.id_seccion}
                        idAyudante={ayudante.id_ayudante}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AyudanteTable;

import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExcelDownloader = ({ filteredPostulaciones, estudiantes }) => {
  const downloadExcel = () => {
    try {
      // Verificar si hay datos
      if (!filteredPostulaciones?.length) {
        alert('No hay datos para exportar');
        return;
      }

      // Preparar los datos para exportar
      const dataToExport = filteredPostulaciones.flatMap((postulacion) =>
        postulacion.materias.map((materia) => ({
          'Nombre del Estudiante':
            estudiantes[postulacion.usuario_id]?.nombre || 'No disponible',
          'RUT del Estudiante':
            estudiantes[postulacion.usuario_id]?.rut || 'No disponible',
          'ID Materia': materia.materia?.id || 'No disponible',
          'Nombre Asignatura': materia.materia?.nombre || 'No disponible',
          'ID Departamento': materia.materia?.id_departamento || 'No disponible',
          'Nota': materia.nota ? Number(materia.nota).toFixed(2) : 'No disponible',
        }))
      );

      // Verificar si hay datos procesados
      if (!dataToExport.length) {
        alert('No se encontraron datos para exportar');
        return;
      }

      // Crear la hoja de cálculo
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);

      // Ajustar el ancho de las columnas
      worksheet['!cols'] = [
        { wch: 25 }, // Nombre del Estudiante
        { wch: 20 }, // RUT del Estudiante
        { wch: 12 }, // ID Materia
        { wch: 40 }, // Nombre Asignatura
        { wch: 15 }, // ID Departamento
        { wch: 8 },  // Nota
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Postulaciones');

      // Generar archivo y descargar
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const fileName = `Postulaciones_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error al generar el Excel:', error);
      alert('Error al generar el archivo Excel: ' + error.message);
    }
  };

  return (
    <button
      className="btn btn-success btn-sm"
      onClick={downloadExcel}
      title="Descargar datos en Excel"
    >
      <i className="bi bi-download"></i> Descargar Excel
    </button>
  );
};

export default ExcelDownloader;

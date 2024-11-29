// src/components/AyudanteExcelDownloader.js
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AyudanteExcelDownloader = ({ ayudantes }) => {
  const downloadExcel = () => {
    try {
      // Verificar si hay ayudantes
      if (!ayudantes?.length) {
        alert('No hay datos para exportar');
        return;
      }

      // Preparar los datos para exportar
      const dataToExport = ayudantes.flatMap((ayudante) =>
        ayudante.asignaturas.map((asignatura) => ({
          RUT: ayudante.rut || 'No disponible',
          Nombre: ayudante.nombre || 'No disponible',
          Email: ayudante.email || 'No disponible',
          'Código Sección': asignatura.codigo || 'No disponible',
          'Nombre Asignatura': asignatura.asignatura || 'No disponible',
          'Departamento ID': asignatura.departamentoId || 'No disponible',
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
        { wch: 12 }, // RUT
        { wch: 25 }, // Nombre
        { wch: 30 }, // Email
        { wch: 15 }, // Código Sección
        { wch: 40 }, // Nombre Asignatura
        { wch: 15 }, // Departamento ID
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Ayudantes');

      // Generar archivo y descargar
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const fileName = `Ayudantes_${new Date().toISOString().split('T')[0]}.xlsx`;
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

export default AyudanteExcelDownloader;

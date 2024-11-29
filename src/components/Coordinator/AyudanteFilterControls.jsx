import React from 'react';
import Filter from '../Filter';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AyudanteFilterControls = ({
  filterText,
  setFilterText,
  filterOption,
  setFilterOption,
  ayudantes = [], // Aseguramos un valor por defecto
}) => {
  // Preparar datos para la exportación en formato Excel
  const downloadExcel = () => {
    try {
      if (!ayudantes || ayudantes.length === 0) {
        alert("No hay datos para exportar");
        return;
      }

      const dataToExport = ayudantes.flatMap((ayudante) =>
        ayudante.asignaturas.map((asignatura) => ({
          RUT: ayudante.rut || "N/A",
          Nombre: ayudante.nombre || "N/A",
          "Sección": asignatura.codigo || "N/A",
          "Nombre Asignatura": asignatura.asignatura || "N/A",
          "Departamento": asignatura.departamentoId || "N/A",
        }))
      );

      if (!dataToExport.length) {
        alert("No se encontraron datos para exportar");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      worksheet["!cols"] = [
        { wch: 12 }, // RUT
        { wch: 25 }, // Nombre
        { wch: 15 }, // Código Sección
        { wch: 40 }, // Nombre Asignatura
        { wch: 15 }, // Departamento ID
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Ayudantes");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `Ayudantes_${new Date().toISOString().split("T")[0]}.xlsx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error al generar el Excel:", error);
      alert("Error al generar el archivo Excel: " + error.message);
    }
  };

  return (
    <div
      className="d-flex align-items-center mb-2"
      style={{
        gap: "10px",
        paddingTop: "10px",
      }}
    >
      {/* Componente de filtro */}
      <Filter filterText={filterText} setFilterText={setFilterText}>
        <div className="position-relative" style={{ width: "250px" }}>
          <select
            className="form-control"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            style={{
              borderRadius: "20px",
              paddingLeft: "16px",
              paddingRight: "30px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #ced4da",
              outline: "none",
              height: "38px",
              appearance: "none",
              backgroundColor: "white",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #2DD69C")}
            onBlur={(e) => (e.target.style.border = "1px solid #ced4da")}
          >
            <option value="">MOSTRAR TODO</option>
            <option value="rut">FILTRAR POR RUT</option>
            <option value="seccion">FILTRAR POR SECCIÓN</option>
            <option value="departamento">FILTRAR POR DEPARTAMENTO</option>
          </select>
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <i className="bi bi-chevron-down" style={{ fontSize: "14px", color: "#2DD69C" }}></i>
          </div>
        </div>
      </Filter>

      {/* Botón para descargar Excel */}
      <div className="ms-auto">
        <button
          className="btn btn-success btn-sm"
          onClick={downloadExcel}
          title="Descargar datos en Excel"
        >
          <i className="bi bi-download"></i> Descargar Excel
        </button>
      </div>
    </div>
  );
};

export default AyudanteFilterControls;

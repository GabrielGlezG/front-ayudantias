import React from 'react';
import Filter from '../Filter';
import ExcelDownloader from '../Selection/ExcelDownloader';
import ViewEvaluationsButton from './ViewEvaluationsButton';

const FilterControls = ({
  filterText,
  setFilterText,
  filterOption,
  setFilterOption,
  filteredPostulaciones,
  estudiantes,
}) => (
  <div
    className="d-flex align-items-center mb-2" // Reduce el margen inferior
    style={{
      gap: '10px',
      paddingTop: '10px', // Añade espacio superior
    }}
  >
    {/* Filter Component */}
    <Filter filterText={filterText} setFilterText={setFilterText}>
      {/* Select inside Filter component as children */}
      <div className="position-relative" style={{ width: '250px' }}>
        <select
          className="form-control"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          style={{
            borderRadius: '20px',
            paddingLeft: '16px',
            paddingRight: '30px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ced4da',
            outline: 'none',
            height: '38px', // Match the height of the input
            appearance: 'none', // Remove default select styling
            backgroundColor: 'white',
          }}
          onFocus={(e) => (e.target.style.border = '1px solid #2DD69C')}
          onBlur={(e) => (e.target.style.border = '1px solid #ced4da')}
        >
          <option value="">MOSTRAR TODO</option>
          <option value="rut">FILTRAR POR RUT</option>
          <option value="codigo">FILTRAR POR CÓDIGO ASIGNATURA</option>
          <option value="departamento">FILTRAR POR DEPARTAMENTO</option>
        </select>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            pointerEvents: 'none', // Ensures the icon doesn't interfere with select
          }}
        >
          <i className="bi bi-chevron-down" style={{ fontSize: '14px', color: '#2DD69C' }}></i>
        </div>
      </div>
    </Filter>

    {/* Excel Downloader */}
    <div className="ms-auto d-flex gap-2">
   <ExcelDownloader 
     filteredPostulaciones={filteredPostulaciones}
     estudiantes={estudiantes}
   />
   <ViewEvaluationsButton idHelper={1} /> {/* Aquí puedes pasar dinámicamente el id */}
</div>

  </div>
);

export default FilterControls;

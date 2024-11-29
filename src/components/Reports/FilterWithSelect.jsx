import React from 'react';
import Filter from '../Filter';

const FilterWithSelect = ({ filterText, setFilterText, filterType, setFilterType }) => {
  return (
    <Filter filterText={filterText} setFilterText={setFilterText}>
      <div className="position-relative" style={{ width: '250px' }}>
        <select
          className="form-control"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            borderRadius: '20px',
            paddingLeft: '16px',
            paddingRight: '30px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ced4da',
            outline: 'none',
            height: '38px',
            appearance: 'none',
            backgroundColor: 'white',
          }}
          onFocus={(e) => (e.target.style.border = '1px solid #2DD69C')}
          onBlur={(e) => (e.target.style.border = '1px solid #ced4da')}
        >
          <option value="TODO">MOSTRAR TODO</option>
          <option value="CODIGO">FILTRAR POR CÓDIGO</option>
          <option value="NOMBRE">FILTRAR POR NOMBRE</option>
        </select>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          <i className="bi bi-chevron-down" style={{ fontSize: '14px', color: '#2DD69C' }}></i>
        </div>
      </div>
    </Filter>
  );
};

export default FilterWithSelect;

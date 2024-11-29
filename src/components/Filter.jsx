import React from 'react';

const Filter = ({ filterText, setFilterText, children }) => {
  return (
    <div
      className="d-flex align-items-center mb-2" // Ajusta el margen inferior
      style={{
        gap: '10px',
        paddingTop: '5px', // Ajusta el padding superior
      }}
    >
      {/* Campo de búsqueda */}
      <div className="position-relative" style={{ width: '250px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            borderRadius: '20px',
            paddingLeft: '40px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ced4da',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.border = '1px solid #2DD69C')}
          onBlur={(e) => (e.target.style.border = '1px solid #ced4da')}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            backgroundColor: '#2DD69C',
            borderRadius: '50%',
            height: '24px',
            width: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i className="bi bi-search" style={{ fontSize: '14px', color: 'white' }}></i>
        </div>
      </div>

      {/* Selector */}
      <div>{children}</div>
    </div>
  );
};

export default Filter;

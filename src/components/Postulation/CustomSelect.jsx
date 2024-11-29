import React from 'react';

const CustomSelect = ({ value, onChange, options }) => {
  return (
    <div className="position-relative" style={{ width: '250px' }}>
      <select
        className="form-control"
        value={value}
        onChange={onChange}
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
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          pointerEvents: 'none', // Evita interferencias con el select
        }}
      >
        <i className="bi bi-chevron-down" style={{ fontSize: '14px', color: '#2DD69C' }}></i>
      </div>
    </div>
  );
};

export default CustomSelect;

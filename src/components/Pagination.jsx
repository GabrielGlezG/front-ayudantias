import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page); // Llama a la función del padre
    }
  };

  return (
    <div className="d-flex justify-content-end align-items-center mt-4">
      {/* Botón de "Atras" */}
      <button
        className="btn btn-link text-secondary"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          color: currentPage === 1 ? '#ccc' : '#000',
        }}
      >
        <i className="bi bi-arrow-left"></i> Atras
      </button>

      {/* Botones de números de página */}
      <div className="d-flex mx-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`btn btn-sm mx-1 ${
              currentPage === index + 1 ? 'btn-success' : 'btn-outline-secondary'
            }`}
            onClick={() => handlePageChange(index + 1)}
            style={{
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              padding: '0',
              fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Botón de "Siguiente" */}
      <button
        className="btn btn-link text-secondary"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          color: currentPage === totalPages ? '#ccc' : '#000',
        }}
      >
        Siguiente <i className="bi bi-arrow-right"></i>
      </button>
    </div>
  );
};

export default Pagination;

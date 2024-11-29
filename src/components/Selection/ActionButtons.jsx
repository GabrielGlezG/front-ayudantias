import React from 'react';

const ActionButtons = ({ onAccept, onReject, isProcessing }) => (
  <div className="d-flex justify-content-center">
    <i
      className="bi bi-check-circle"
      style={{ fontSize: '1.5rem', color: 'green', cursor: 'pointer' }}
      onClick={onAccept}
      disabled={isProcessing}
    ></i>
    <i
      className="bi bi-x-circle ms-3"
      style={{ fontSize: '1.5rem', color: 'red', cursor: 'pointer' }}
      onClick={onReject}
      disabled={isProcessing}
    ></i>
  </div>
);

export default ActionButtons;

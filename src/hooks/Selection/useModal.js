import { useState } from 'react';

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (titulo, mensaje, onConfirm) => {
    setModalData({ titulo, mensaje, onConfirm });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  return {
    isModalOpen,
    modalData,
    openModal,
    closeModal
  };
};
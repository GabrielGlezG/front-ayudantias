import { useState } from 'react';
import { interactuarPostulacion } from '../../api/InteractuarPostulacionService';

export const usePostulacionActions = (
  assignedSections,
  setPermanentSections,
  setPostulaciones,
  notifySuccess,
  notifyError
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async (idPostulacion, materiaId) => {
    const seccionAsignada = assignedSections[materiaId];
    if (!seccionAsignada) {
      notifyError('Debe asignar una sección antes de aceptar.');
      return false;
    }

    setIsProcessing(true);
    try {
      await interactuarPostulacion({
        id: idPostulacion,
        estado: true,
        id_seccion: seccionAsignada.id,
      });

      setPermanentSections((prev) => ({
        ...prev,
        [seccionAsignada.id]: {
          id: seccionAsignada.id,
          number: seccionAsignada.number,
          timestamp: new Date().toISOString(),
        },
      }));

      notifySuccess('Postulación aceptada exitosamente.');
      updatePostulaciones(idPostulacion, setPostulaciones);
      return true;
    } catch (err) {
      console.error('Error al aceptar la postulación:', err.message);
      notifyError('Error al aceptar la postulación. Intente nuevamente.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (idPostulacion) => {
    setIsProcessing(true);
    try {
      await interactuarPostulacion({
        id: idPostulacion,
        estado: false,
        id_seccion: null,
      });
      notifySuccess('Postulación rechazada exitosamente.');
      updatePostulaciones(idPostulacion, setPostulaciones);
      return true;
    } catch (err) {
      console.error('Error al rechazar la postulación:', err.message);
      notifyError('Error al rechazar la postulación. Intente nuevamente.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleAccept,
    handleReject,
    isProcessing
  };
};
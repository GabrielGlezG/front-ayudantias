// src/api/postulantesService.js
export const enviarPostulaciones = async (materiaUN) => {
    try {
      const response = await fetch('http://localhost:6060/api/v1/postulantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materiaUN }),
      });
  
      const data = await response.json();
  
      if (!data.success) {
        throw new Error(data.message || 'Error al enviar las postulaciones.');
      }
  
      return data; // Retorna la respuesta si es exitosa
    } catch (error) {
      throw new Error(error.message || 'Error en la conexión al servidor.');
    }
  };
  
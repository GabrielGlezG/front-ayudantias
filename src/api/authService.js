// src/api/authService.js
export const loginUser = async (rut, rol) => {
    try {
      const response = await fetch('http://localhost:6060/api/v1/auntenticacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, rol }),
      });
      const data = await response.json();
  
      if (!data.success) {
        throw new Error('Rut no válido. Intenta nuevamente.');
      }
  
      return data.body; // Devuelve el objeto de respuesta con el rol y el ID de usuario
    } catch (error) {
      throw new Error(error.message || 'Error en la autenticación. Intenta nuevamente más tarde.');
    }
  };
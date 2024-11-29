const API_BASE_URL = 'http://localhost:6060/api/v1';

export const enviarReporte = async ({ id_ayudante, id_seccion, contenido }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ayudantes/reporte`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_ayudante,
        id_seccion,
        contenido,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al enviar el reporte: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Error en la respuesta del servidor.');
    }

    return data; // Devuelve la respuesta exitosa
  } catch (error) {
    console.error('Error en enviarReporte:', error);
    throw error;
  }
};

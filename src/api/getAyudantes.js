const API_BASE_URL = 'http://localhost:6060/api/v1';

export const fetchAyudantes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ayudantes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener ayudantes: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('Error en la respuesta de la API.');
    }

    return data.body.Ayudantes; // Devuelve el array de ayudantes
  } catch (error) {
    console.error('Error en fetchAyudantes:', error);
    throw error;
  }
};

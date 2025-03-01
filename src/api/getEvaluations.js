const API_BASE_URL = 'http://localhost:6060/api/v1';

export const fetchEvaluationsByHelper = async (idHelper) => {
  try {
    const response = await fetch(`${API_BASE_URL}/evaluations/${idHelper}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener evaluaciones: ${response.statusText}`);
    }

    const data = await response.json();
    return data.body || [];
  } catch (error) {
    console.error('Error en fetchEvaluationsByHelper:', error);
    throw error;
  }
};

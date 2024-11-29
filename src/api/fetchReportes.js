const API_BASE_URL = 'http://localhost:6060/api/v1';

export const fetchReportesBySeccion = async (idSeccion) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reportes/seccion/${idSeccion}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener reportes: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success) {
      return data.body.Reportes || [];
    } else {
      throw new Error('No se pudieron cargar los reportes.');
    }
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    throw error;
  }
};

const API_BASE_URL = 'http://localhost:6060/api/v1';

export const submitEvaluation = async (evaluationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/evaluations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evaluationData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error en la respuesta:", errorResponse);
      throw new Error(errorResponse.detail ? errorResponse.detail[0].msg : 'Error al enviar la evaluación.');
    }

    return { success: true };
  } catch (error) {
    console.error('Error en submitEvaluation:', error);
    throw error;
  }
};

export const interactuarPostulacion = async (body) => {
  console.log('Body enviado al backend:', body); // Agrega este console.log
  const response = await fetch('http://localhost:6060/api/v1/postulantes/interactuar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error recibido del backend:', error); // Agrega este console.log
    throw new Error(error.detail || 'Error en la interacción de la postulación.');
  }

  return response.json();
};

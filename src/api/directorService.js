export const fetchPostulaciones = async (page, limit) => {
  try {
    console.log(`Fetching postulaciones - Page: ${page}, Limit: ${limit}`);
    
    const response = await fetch(`http://localhost:6060/api/v1/postulantes?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // Añade cualquier token de autorización si es necesario
        // 'Authorization': `Bearer ${token}`
      }
    });

    console.log('Respuesta del servidor:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response text:', errorText);
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Datos JSON:', data);
    
    return data;
  } catch (error) {
    console.error('Error en fetchPostulaciones:', error);
    throw error;
  }
};


//esto funciona para selection pero para postulation da problemas.
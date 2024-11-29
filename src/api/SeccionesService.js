export async function fetchSecciones(idMateria) {
  try {
    const response = await fetch(`http://localhost:6060/api/v1/secciones/${idMateria}`, { // Corrige la URL con "/"
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log("Sección obtenida con éxito:", data.body.Seccion);
      return data.body.Seccion;
    } else {
      console.error("Error al obtener la sección:", data.message || "Respuesta no exitosa");
      return null;
    }
  } catch (error) {
    console.error("Error al realizar el fetch:", error.message);
    return null;
  }
}

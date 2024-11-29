// src/api/materiasService.js

export const fetchMateriasAprobadas = async (userId, page, items_per_page) => {
  try {
    const response = await fetch(
      `http://localhost:6060/api/v1/estudiantes/materias_aprobadas/${userId}?page=${page}&items_per_page=${items_per_page}`
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error('Error al obtener las materias aprobadas.');
    }

    const materiasAprobadas = data.body?.materias_aprobada; // Accede al campo correcto

    if (!Array.isArray(materiasAprobadas)) {
      throw new Error('Las materias no están disponibles en el formato esperado.');
    }

    // Devuelve las materias transformadas junto con la información de paginación
    return {
      materias: materiasAprobadas.map((item) => ({
        id_materia_usuario_nota: item.id,
        nombre: item.materia.nombre,
        codigo: String(item.materia.id), // Convertir ID a cadena
        departamento: {
          nombre: `Departamento ${item.materia.id_departamento}`,
        },
      })),
      totalPages: data.body.total_pages || 2, // Asumiendo que el backend devuelve total_pages
    };
  } catch (error) {
    throw new Error(error.message || 'Error en la conexión con el servidor.');
  }
};

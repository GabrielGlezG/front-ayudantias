export const fetchEstudiante = async (userId) => {
    try {
      const response = await fetch(`http://localhost:6060/api/v1/estudiantes`);
      const data = await response.json();
  
      if (!data.success || !Array.isArray(data.body)) {
        throw new Error('No se pudo obtener la información de los estudiantes.');
      }
  
      // Buscar el estudiante por ID
      const estudiante = data.body.find((item) => item.id === parseInt(userId, 10));
  
      if (!estudiante) {
        throw new Error(`Estudiante con ID ${userId} no encontrado.`);
      }
  
      return {
        nombre: estudiante.nombre,
        rut: estudiante.rut,
        email: estudiante.email
      };
    } catch (error) {
      console.error('Error al obtener la información del estudiante:', error.message);
      throw error;
    }
  };
  
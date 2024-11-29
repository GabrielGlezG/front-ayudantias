export const updatePostulaciones = (idPostulacion, setPostulaciones) => {
    setPostulaciones((prev) =>
      prev.map(postulacion => ({
        ...postulacion,
        materias: postulacion.materias.filter(materia =>
          materia.id_postulacion !== idPostulacion
        )
      })).filter(postulacion => postulacion.materias.length > 0)
    );
  };
  
  export const filterPostulaciones = (postulaciones, estudiantes, filterOption, filterText) => {
    return postulaciones.filter((postulacion) => {
      const estudiante = estudiantes[postulacion.usuario_id];
      if (!estudiante) return false;
  
      switch (filterOption) {
        case 'rut':
          return estudiante.rut?.toLowerCase().includes(filterText.toLowerCase());
        case 'codigo':
          return postulacion.materias.some((materia) =>
            String(materia.materia.id)?.toLowerCase().includes(filterText.toLowerCase())
          );
        case 'departamento':
          return postulacion.materias.some((materia) =>
            materia.materia.id_departamento?.toString().toLowerCase().includes(filterText.toLowerCase())
          );
        default:
          return true;
      }
    });
  };
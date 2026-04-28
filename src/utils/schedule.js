export function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function validarBloque(bloque, existentes, excludeId = null) {
  if (!bloque.startTime || !bloque.endTime) {
    return "Debes definir hora de inicio y fin.";
  }

  const inicio = timeToMinutes(bloque.startTime);
  const fin = timeToMinutes(bloque.endTime);

  if (inicio >= fin) {
    return "La hora de inicio debe ser menor que la hora de fin.";
  }

  const solapa = (existentes || []).some(b => {
    if (excludeId && b.id === excludeId) return false;
    if (b.dayOfWeek !== bloque.dayOfWeek) return false;
    const eInicio = timeToMinutes(b.startTime);
    const eFin = timeToMinutes(b.endTime);
    return inicio < eFin && fin > eInicio;
  });

  if (solapa) {
    return "El bloque se solapa con otro en el mismo día.";
  }

  return "";
}

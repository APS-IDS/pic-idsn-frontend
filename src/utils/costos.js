const isEmpty = (value) => value === null || value === undefined || value === "";

// Valor total de una actividad a partir de sus costos (anexos 2026). Devuelve
// el texto sin formato que guarda el formulario, o null si no hay costos.
export const sumCostos = (costoDirecto, costoIndirecto) => {
  if (isEmpty(costoDirecto) && isEmpty(costoIndirecto)) return null;

  const total = [costoDirecto, costoIndirecto]
    .filter((costo) => !isEmpty(costo))
    .reduce((sum, costo) => sum + Number(costo), 0);

  return String(Math.round(total * 100) / 100);
};

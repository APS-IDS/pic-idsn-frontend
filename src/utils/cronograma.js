// Suma del cronograma de una actividad tal como se guarda: el envío convierte
// cada peso con parseInt, así que se suma igual para validar lo que se guarda.
export const sumCronograma = (cronograma) =>
  (cronograma ?? []).reduce((sum, item) => sum + (parseInt(item.peso, 10) || 0), 0);

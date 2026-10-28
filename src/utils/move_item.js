// Devuelve una copia de la lista con el elemento de `from` movido a `to`.
export const moveItem = (list, from, to) => {
  const result = [...list];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
};

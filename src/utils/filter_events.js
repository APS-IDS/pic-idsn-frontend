const normalize = (text) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const labelOf = (options, value) =>
  options.find((option) => option.value === value)?.label;

// Un evento coincide si cada palabra buscada aparece en alguno de sus campos
// representativos; proyecto y operador se buscan por nombre, no por id.
export const eventMatchesSearch = (event, search, { proyectos = [], operadores = [] } = {}) => {
  const words = normalize(search).split(/\s+/).filter(Boolean);
  if (!words.length) return true;

  const text = normalize(
    [
      event.description_event,
      event.indicator_name,
      event.meta_indicator,
      labelOf(proyectos, event.proyecto),
      labelOf(operadores, event.operador_pic),
    ].join(" "),
  );

  return words.every((word) => text.includes(word));
};

const normalize = (text) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const labelOf = (options, value) =>
  options.find((option) => option.value === value)?.label;

// Un evento coincide si cada palabra buscada aparece en alguno de sus campos
// representativos; proyecto y operador se buscan por nombre, no por id.
const textsMatchSearch = (texts, search) => {
  const words = normalize(search).split(/\s+/).filter(Boolean);
  if (!words.length) return true;

  const text = normalize(texts.join(" "));
  return words.every((word) => text.includes(word));
};

// Evento en el formato del formulario de edición.
export const eventMatchesSearch = (event, search, { proyectos = [], operadores = [] } = {}) =>
  textsMatchSearch(
    [
      event.description_event,
      event.indicator_name,
      event.meta_indicator,
      labelOf(proyectos, event.proyecto),
      labelOf(operadores, event.operador_pic),
    ],
    search,
  );

// Evento tal como lo devuelve la API (lista de anexos).
export const apiEventMatchesSearch = (evento, search) =>
  textsMatchSearch(
    [
      evento.descripcion,
      evento.indicador_evento,
      evento.meta_indicador_evento,
      evento.proyectos_idsn?.proyecto,
      evento.operador_pic?.operador_pic,
    ],
    search,
  );

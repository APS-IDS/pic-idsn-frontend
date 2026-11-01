// Contenido del aviso cuando el backend responde 422 porque el guardado
// elimina soportes o actividades que ya tienen seguimientos u observaciones,
// que se borran junto con ellos.

const escapeHtml = (text) =>
  String(text ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
  );

const shorten = (text, max = 120) => {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
};

const count = (n, singular, plural) => `${n} ${n === 1 ? singular : plural}`;

export const describePendingRemovals = ({ soportes = [], actividades = [] } = {}) => {
  const items = [
    ...actividades.map(
      (actividad) =>
        `Actividad: ${shorten(actividad.descripcion) || "(sin descripción)"} — ` +
        count(actividad.observaciones, "observación", "observaciones"),
    ),
    ...soportes.map(
      (soporte) =>
        `Soporte ${soporte.tipo || ""}: ${shorten(soporte.descripcion) || "(sin descripción)"} — ` +
        (soporte.evidencias
          ? count(soporte.evidencias, "evidencia", "evidencias")
          : "seguimiento sin evidencias"),
    ),
  ];

  return (
    "<p>Al guardar se eliminarán estos elementos, que ya tienen registros:</p>" +
    `<ul style="text-align:left;margin:12px 0;padding-left:20px">${items
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("")}</ul>` +
    "<p>Sus seguimientos, evidencias y observaciones se borrarán definitivamente. " +
    "Esta acción no se puede deshacer. ¿Quieres continuar?</p>"
  );
};

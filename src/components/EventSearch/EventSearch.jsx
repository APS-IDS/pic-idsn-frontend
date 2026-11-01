// Campo de búsqueda de eventos: formulario de edición y lista de anexos.
const EventSearch = ({ value, onChange }) => (
  <input
    type="search"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    // Enter dentro de un formulario lo enviaría y guardaría el anexo.
    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
    placeholder="Buscar por descripción, indicador, proyecto u operador"
    aria-label="Buscar eventos"
    className="w-full max-w-md p-2 border border-app-border rounded-md text-sm bg-app-card text-app-text"
  />
);

export default EventSearch;

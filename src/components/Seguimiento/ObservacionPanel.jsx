import React from "react";
import styles from "./Seguimiento.module.css";
const PORCENTAJE_OPTIONS = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  100,
];

const EMOJI_REFERENTE = {
  "Sin Reporte": "📄",
  "No aplica para periodo": "🚫",
  "Avance Limitado": "⚠️",
  "Actividad con avance": "📈",
  "Actividad cerrada": "✅",
  "Ajustar soportes": "🛠️",
};

const EMOJI_OPERADOR = {
  "No Aplica para periodo": "🚫",
  "Reporte Actualizado": "♻️",
  "Reporte de avance": "📈",
  "Sin avance": "⚠️",
};

const ObservacionPanel = ({
  observacion,
  fecha,
  usuarioAutor,
  porcentaje,
  estado,
  canEdit,
  aviso,
  name,
  onChange,
  onChangeState,
  estados,
}) => {
  const emojiMap = name === "referente" ? EMOJI_REFERENTE : EMOJI_OPERADOR;

  return (
    <div className="bg-app-card border border-app-border rounded-xl mb-4 overflow-hidden shadow-sm">
      <div className="bg-teal text-app-card py-3 px-4 flex  justify-between items-center  font-semibold cursor-pointer">
        {"Seguimiento " + name[0].toUpperCase() + name.slice(1)}
      </div>

      <div className="p-4">
        {aviso && (
          <p className="mb-4 rounded-md border border-app-border bg-gray-100 p-2 text-sm text-app-muted">
            🔒 {aviso}
          </p>
        )}
        <div className="flex flex-row gap-4 mb-4">
          <div>
            <label className={styles.label}>Usuario</label>
            <input
              className={"pointer-events-none opacity-70"}
              type="text"
              value={usuarioAutor || "Sin usuario"}
              disabled={!canEdit}
              onChange={onChange}
            />
          </div>
          <div>
            <label className={styles.label}>Fecha</label>
            <input
              className="mb-2 pointer-events-none opacity-70"
              type="text"
              value={fecha || "Sin fecha"}
              disabled={!canEdit}
              onChange={onChange}
            />
          </div>
        </div>

        <label className={styles.label}>Observación</label>

        <textarea
          className="p-2"
          name={"observacion_" + name}
          value={observacion}
          onChange={onChange}
          disabled={!canEdit}
        />

        {
          <div className="flex flex-row gap-4 mb-4">
            <div>
              <label className={styles.label}>Porcentaje</label>

              <select
                name={"porcentaje_" + name}
                className="w-full p-2 pr-10 border border-app-border rounded-md text-sm cursor-pointer hover:bg-gray-200 bg-no-repeat bg-[position:right_10px_center] focus:outline-none focus:border-green-brand focus:ring-1 focus:ring-green-brand"
                value={porcentaje}
                onChange={onChangeState}
                disabled={!canEdit}
              >
                {PORCENTAJE_OPTIONS.map((val) => (
                  <option key={val} value={val}>
                    {val}%
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>Estado</label>

              <select
                name={"estado_" + name}
                className="w-full p-2 pr-10 border border-app-border rounded-md text-sm cursor-pointer hover:bg-gray-200 bg-no-repeat bg-[position:right_10px_center] focus:outline-none focus:border-green-brand focus:ring-1 focus:ring-green-brand"
                value={estado}
                onChange={onChangeState}
                disabled={!canEdit}
              >
                <option value="Sin Estado" disabled>
                  🟡 Selecciona un estado
                </option>
                {estados?.map((est) => (
                  <option key={est.id} value={est.estado_actividad}>
                    {emojiMap[est.estado_actividad] || "❓"}{" "}
                    {est.estado_actividad}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default ObservacionPanel;

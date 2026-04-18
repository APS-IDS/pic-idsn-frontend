import React from "react";
import styles from "./Seguimiento.module.css";

const PORCENTAJE_OPTIONS = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
  95, 100,
];

const EstadoPanel = ({
  canEdit,
  porcentaje,
  estado,
  porcentajeName,
  estadoName,
  estados,
  emojiMap,
  onChange,
}) => (
  <table>
    <thead>
      <tr>
        <th>Porcentaje</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          {canEdit ? (
            <select
              name={porcentajeName}
              className={styles.select}
              value={porcentaje}
              onChange={onChange}
            >
              {PORCENTAJE_OPTIONS.map((val) => (
                <option key={val} value={val}>
                  {val}%
                </option>
              ))}
            </select>
          ) : (
            <p>{porcentaje}%</p>
          )}
        </td>
        <td>
          {canEdit ? (
            <select
              name={estadoName}
              className={styles.select}
              value={estado}
              onChange={onChange}
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
          ) : (
            <p>
              {estado && (
                <>
                  {emojiMap[estado] || "❓"} {estado}
                </>
              )}
            </p>
          )}
        </td>
      </tr>
    </tbody>
  </table>
);

export default EstadoPanel;

import React from "react";
import styles from "./Seguimiento.module.css";

const ObservacionPanel = ({
  observacion,
  fecha,
  usuarioAutor,
  canEdit,
  name,
  onChange,
}) => (
  <table>
    <thead>
      <tr>
        <th>Observacion</th>
        {fecha && <th>Fecha</th>}
        {usuarioAutor && <th>Usuario</th>}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          {canEdit ? (
            <textarea
              className={styles.textarea}
              name={name}
              value={observacion}
              onChange={onChange}
            />
          ) : (
            <p
              style={{
                margin: 0,
                padding: "5px",
                fontSize: "16px",
                width: "200px",
              }}
            >
              {observacion}
            </p>
          )}
        </td>
        {fecha && (
          <td>
            <p
              style={{
                margin: 0,
                padding: "5px",
                fontSize: "16px",
                width: "200px",
              }}
            >
              {fecha}
            </p>
          </td>
        )}
        {usuarioAutor && (
          <td>
            <p
              style={{
                margin: 0,
                padding: "5px",
                fontSize: "16px",
                width: "200px",
              }}
            >
              {usuarioAutor}
            </p>
          </td>
        )}
      </tr>
    </tbody>
  </table>
);

export default ObservacionPanel;

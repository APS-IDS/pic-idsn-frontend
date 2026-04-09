import React from "react";
import { FaSave } from "react-icons/fa";
import styles from "./Seguimiento.module.css";
import EvidenciasTable from "./EvidenciasTable";

const getEmojiEstado = (estado) => {
  if (estado.includes("No Aprobado soporte fisico")) return "❌";
  if (estado.includes("No aprobado")) return "❌";
  if (estado.includes("Aprobado soporte fisico")) return "✅";
  if (estado.includes("Aprobado")) return "✅";
  return "❔";
};

const SoportesTable = ({
  soportes,
  soportesData,
  estadoSoportes,
  estadosBack,
  usuario,
  onVerSoporte,
  onEstadoChange,
  onSendCheck,
}) => (
  <table className={styles.table_soportes} style={{ marginBottom: "1rem" }}>
    <thead>
      <tr>
        <th>Tipo Soporte</th>
        <th>Descripción</th>
        <th>Cantidad</th>
        <th>Soportes</th>
        <th>Check</th>
        {usuario === "referente_instituto" && <th>Guardar</th>}
      </tr>
    </thead>
    <tbody>
      {soportes.map((soporte, index) => {
        const evidencias = soportesData[soporte.uuid]?.evidencias;
        const hasEvidencias = evidencias?.length > 0;

        return (
          <tr key={index}>
            <td
              style={{
                width: "200px",
                maxWidth: "200px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {soporte.tipo}
            </td>
            <td
              style={{
                wordWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: "150px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {soporte.descripcion}
              </p>
            </td>
            <td>{soporte.cantidad}</td>
            <td>
              <EvidenciasTable
                evidencias={evidencias}
                onVerSoporte={onVerSoporte}
              />
            </td>
            <td>
              {usuario === "referente_instituto" ? (
                hasEvidencias ? (
                  <select
                    className={styles.select}
                    value={estadoSoportes[soporte.uuid] || ""}
                    onChange={(e) =>
                      onEstadoChange(soporte.uuid, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      🟡 Selecciona un estado
                    </option>
                    {estadosBack.map((estado) => (
                      <option key={estado.id} value={estado.estado_soporte}>
                        {getEmojiEstado(estado.estado_soporte)}{" "}
                        {estado.estado_soporte}
                      </option>
                    ))}
                  </select>
                ) : null
              ) : (
                <p>
                  {estadoSoportes[soporte.uuid] ? (
                    <>
                      {getEmojiEstado(estadoSoportes[soporte.uuid])}{" "}
                      {estadoSoportes[soporte.uuid]}
                    </>
                  ) : (
                    <>❔ Sin check</>
                  )}
                </p>
              )}
            </td>
            {usuario === "referente_instituto" && (
              <td>
                {hasEvidencias && (
                  <button
                    className={styles.edit_button}
                    onClick={() => onSendCheck(soporte.uuid)}
                  >
                    <FaSave />
                  </button>
                )}
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default SoportesTable;

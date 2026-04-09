import React from "react";
import styles from "./Seguimiento.module.css";

const EvidenciasTable = ({ evidencias, onVerSoporte }) => (
  <table className={styles.table_evidencias}>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Tipo</th>
        <th>Archivo</th>
        <th>Región</th>
      </tr>
    </thead>
    <tbody>
      {evidencias?.length > 0 ? (
        evidencias.map((evidencia, i) => (
          <tr key={i}>
            <td>{evidencia.file_name}</td>
            <td>{evidencia.evidencia_type === "link" ? "Enlace" : "Archivo"}</td>
            <td>
              {evidencia.evidencia_type === "link" ? (
                <a
                  href={evidencia.evidencia_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.edit_button}
                  style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}
                >
                  Ver enlace
                </a>
              ) : (
                <button
                  className={styles.edit_button}
                  onClick={() => onVerSoporte(evidencia.documentId)}
                  style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}
                >
                  Ver soporte
                </button>
              )}
            </td>
            <td>{evidencia.municipio.label}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" style={{ textAlign: "center" }}>
            No hay archivos
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default EvidenciasTable;

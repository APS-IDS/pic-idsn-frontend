import React from "react";
import styles from "./Seguimiento.module.css";

const EvidenciasTable = ({ evidencias, onVerSoporte }) => (
  <table className={styles.table_evidencias}>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Archivo</th>
        <th>Región</th>
      </tr>
    </thead>
    <tbody>
      {evidencias?.length > 0 ? (
        evidencias.map((evidencia, i) => (
          <tr key={i}>
            <td>{evidencia.file_name}</td>
            <td>
              <button
                className={styles.edit_button}
                onClick={() => onVerSoporte(evidencia.documentId)}
              >
                Ver soporte
              </button>
            </td>
            <td>{evidencia.municipio.label}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="3" style={{ textAlign: "center" }}>
            No hay archivos
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default EvidenciasTable;

import React from "react";
import styles from "./Seguimiento.module.css";

const CronogramaTable = ({ cronograma }) => (
  <table className={styles.subTable} style={{ marginBottom: "1rem" }}>
    <thead>
      <tr>
        <th>Mes</th>
        <th>Porcentaje</th>
      </tr>
    </thead>
    <tbody>
      {cronograma.map((crono, index) =>
        Object.entries(crono).map(([mes, porcentaje]) =>
          porcentaje > 0 ? (
            <tr key={`${index}-${mes}`}>
              <td>{mes}</td>
              <td>{porcentaje}%</td>
            </tr>
          ) : null,
        ),
      )}
    </tbody>
  </table>
);

export default CronogramaTable;

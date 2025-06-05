import React from "react";
import styles from "./ReportFields.module.css";

const ReportFields = ({ reportData, handleChange }) => (
  <div className={styles.tableContainer}>
    <div className={styles.tableHeader}>
      <div>Subregion</div>
      <div>Municipio priorizado</div>
      <div>Código - Nombre de Territorio APS</div>
      <div>Código micro-Territorio</div>
      <div>Total número de Hogares Beneficiarios</div>
    </div>

    <div className={styles.tableRow}>
      <div>
        <input
          type="text"
          name="subregion"
          value={reportData.subregion}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="text"
          name="municipio"
          value={reportData.municipio}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="text"
          name="codigo_territorio"
          value={reportData.codigo_territorio}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="text"
          name="codigo_micro_territorio"
          value={reportData.codigo_micro_territorio}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="text"
          name="numero_hogares"
          value={reportData.numero_hogares}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  </div>
);

export default ReportFields;

import React from "react";
import styles from "./Seguimiento.module.css";
import { View } from "lucide-react"; // Importar íconos

const EvidenciasTable = ({ evidencias, onVerSoporte }) => {
  const [openSoportes, setOpenSoportes] = React.useState(false);

  const toggleSoportes = (button) => {
    setOpenSoportes(!openSoportes);
  };
  return (
    <>
      <button
        className="flex items-center gap-1 font-semibold text-sm border border-gray-300 p-2 rounded-lg text-app-muted hover:bg-teal-light hover:text-teal  transition-colors"
        onClick={(e) => toggleSoportes(e.currentTarget)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" /><path d="M4 9h16" /></svg>

        {openSoportes ? "Ocultar" : "Ver"}
      </button>
      {openSoportes && (
        <div className="mt-2 p-3 bg-slate-100">
          <table>
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
                          className="flex items-center gap-1 font-semibold text-sm border border-gray-300 p-2 rounded-lg text-app-muted hover:bg-teal-light hover:text-teal  transition-colors"
                          onClick={() => onVerSoporte(evidencia.documentId)}
                          style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}
                        >
                          Ver
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
        </div>
      )}

    </>

  )
};

export default EvidenciasTable;

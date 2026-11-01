import React from "react";
import styles from "./Seguimiento.module.css";
import { View } from "lucide-react"; // Importar íconos
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const EvidenciasTable = ({ evidencias }) => {
  const [openSoportes, setOpenSoportes] = React.useState(false);

  const toggleSoportes = (button) => {
    setOpenSoportes(!openSoportes);
  };

  const token =
    useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;

  const back = import.meta.env.VITE_APP_BACK;

  const verSoporte = async (uuid) => {
    try {
      const response = await fetch(`${back}/api/seguimiento/get-file/${uuid}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // tu token JWT
        },
      });

      if (!response.ok) throw new Error("Error al obtener el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al obtener el archivo!",
      });
    }
  };
  return (
    <>
      <button
        className="flex items-center gap-1 font-semibold text-sm border border-gray-300 p-2 rounded-lg text-app-muted hover:bg-teal-light hover:text-teal  transition-colors"
        onClick={(e) => toggleSoportes(e.currentTarget)}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16v16H4z" />
          <path d="M4 9h16" />
        </svg>

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
                    <td>
                      {evidencia.evidencia_type === "link"
                        ? "Enlace"
                        : "Archivo"}
                    </td>
                    <td>
                      {evidencia.evidencia_type === "link" ? (
                        <a
                          href={evidencia.evidencia_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.edit_button}
                          style={{
                            textDecoration: "none",
                            display: "inline-block",
                            textAlign: "center",
                          }}
                        >
                          Ver enlace
                        </a>
                      ) : (
                        <button
                          className="flex items-center gap-1 font-semibold text-sm border border-gray-300 p-2 rounded-lg text-app-muted hover:bg-teal-light hover:text-teal  transition-colors"
                          onClick={() => verSoporte(evidencia.documentId)}
                          style={{
                            textDecoration: "none",
                            display: "inline-block",
                            textAlign: "center",
                          }}
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
  );
};

export default EvidenciasTable;

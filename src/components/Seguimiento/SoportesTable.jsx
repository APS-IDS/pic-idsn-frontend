import React from "react";
import { FaSave } from "react-icons/fa";
import styles from "./Seguimiento.module.css";
import EvidenciasTable from "./EvidenciasTable";
import { CustomRoles } from "../../components/Login/constant";

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
}) => {
  const [open, setOpen] = React.useState(true);

  return (

    <div className="bg-app-card border border-app-border rounded-xl mb-4 overflow-hidden shadow-sm">
      <div className="bg-teal text-app-card py-3 px-4 flex  justify-between items-center  font-semibold cursor-pointer" onClick={() => setOpen(!open)}>
        Soportes
        <span className={`inline-block transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}>
          &#9660;
        </span>
      </div>

      {open && (<div className="py-3 px-4">
        <table className={styles.mini}>
          <thead>
            <tr>
              <th>Tipo Soporte</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Soportes</th>
              <th>Check</th>
              {usuario === CustomRoles.REFERENTE_INSTITUTO && <th>Guardar Estado</th>}
            </tr>
          </thead>
          <tbody>
            {soportes.map((soporte, index) => {
              const evidencias = soportesData[soporte.uuid]?.evidencias;
              const hasEvidencias = evidencias?.length > 0;

              return (
                <tr key={index}>
                  <td>{soporte.tipo}</td>
                  <td>{soporte.descripcion}</td>
                  <td>{soporte.cantidad}</td>
                  <td>{hasEvidencias ? (
                    <EvidenciasTable
                      evidencias={evidencias}
                      onVerSoporte={onVerSoporte}
                    />
                  ) : (
                    <div className="text-sm text-app-muted">No hay evidencias</div>
                  )}
                  </td>
                  <td>
                    {usuario === CustomRoles.REFERENTE_INSTITUTO ? (
                      hasEvidencias ? (
                        <select
                          className="w-full p-2 pr-10 border border-app-border rounded-md text-sm cursor-pointer hover:bg-gray-200 bg-no-repeat bg-[position:right_10px_center] focus:outline-none focus:border-green-brand focus:ring-1 focus:ring-green-brand"
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
                      ) : <div className="text-sm text-app-muted">N/A</div>
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
                  {usuario === CustomRoles.REFERENTE_INSTITUTO && (
                    <td>
                      {hasEvidencias ? (
                        <button
                          className="bg-teal text-white py-2 px-6 text-sm cursor-pointer border rounded-md hover:bg-teal-dark font-semibold" onClick={() => onSendCheck(soporte.uuid)}
                        >
                          <FaSave />
                        </button>
                      ) : (
                        <div className="text-sm text-app-muted">N/A</div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>)}


    </div>

  );
}

export default SoportesTable;

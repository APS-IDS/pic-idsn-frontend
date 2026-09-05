import React from "react";
import { FaClipboardList, FaPaperclip } from "react-icons/fa";
import { CustomRoles } from "../Login/constant";
import {
  SIN_DATO,
  formatMoney,
  formatCronograma,
  listarNombres,
} from "./utils";

const Dato = ({ etiqueta, valor }) => (
  <span className="text-app-muted">
    {etiqueta}: <b className="font-bold text-app-text">{valor}</b>
  </span>
);

const ActividadCard = ({
  actividad,
  documentId,
  anexoDate,
  usuario,
  onSoporte,
}) => {
  const soportes = actividad?.soportes ?? [];
  const puedeCargarSoportes = usuario === CustomRoles.OPERADOR;

  const handleClickActividad = (anexoId, actividadId) => {
    const rutaSeguimiento = `/anexo/${anexoId}/${actividadId}/seguimiento`;
    const enlace = document.createElement("a");
    enlace.href = rutaSeguimiento;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.click();
  };

  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-app-border last:mb-0">
      <div className="border-b border-app-border px-4 py-3">
        <p className="mb-1.5 text-sm font-bold text-navy">
          {actividad?.descripcion || SIN_DATO}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <Dato
            etiqueta="Cantidad a ejecutar"
            valor={`${actividad?.cantidad_a_ejecutar ?? SIN_DATO} ${actividad?.unidad_medida ?? ""}`.trim()}
          />
          <Dato
            etiqueta="Población sujeto"
            valor={listarNombres(actividad?.poblaciones)}
          />
          <Dato
            etiqueta="Valor total"
            valor={formatMoney(actividad?.valor_total)}
          />
          <Dato
            etiqueta="Cronograma"
            valor={formatCronograma(actividad?.cronograma)}
          />
        </div>
      </div>

      <div className="bg-[#f8fafb] px-4 py-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy">
          Soportes
        </p>

        {soportes.length > 0 ? (
          <table className="w-full border-collapse overflow-hidden rounded-md border border-app-border bg-app-card text-xs">
            <thead>
              <tr>
                <th className="border-b-2 border-teal bg-teal-light p-2 text-left font-bold text-teal-dark">
                  Tipo Soporte
                </th>
                <th className="border-b-2 border-teal bg-teal-light p-2 text-left font-bold text-teal-dark">
                  Descripción
                </th>
                <th className="border-b-2 border-teal bg-teal-light p-2 text-left font-bold text-teal-dark">
                  Cantidad
                </th>
                {puedeCargarSoportes && (
                  <th className="border-b-2 border-teal bg-teal-light p-2 text-left font-bold text-teal-dark">
                    Archivos
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {soportes.map((soporte, i) => (
                <tr key={soporte.uuid || soporte.id || i}>
                  <td className="border-b border-app-border p-2 align-middle">
                    {soporte?.tipo || SIN_DATO}
                  </td>
                  <td className="border-b border-app-border p-2 align-middle">
                    {soporte?.descripcion || SIN_DATO}
                  </td>
                  <td className="border-b border-app-border p-2 align-middle">
                    {soporte?.cantidad ?? 0}
                  </td>
                  {puedeCargarSoportes && (
                    <td className="border-b border-app-border p-2 align-middle">
                      {(soporte?.cantidad ?? 0) > 0 ? (
                        <button
                          type="button"
                          onClick={() => onSoporte(documentId, soporte.uuid)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-teal bg-app-card px-3 py-1.5 font-bold text-teal-dark hover:bg-teal hover:text-white"
                        >
                          <FaPaperclip /> Cargar soporte
                        </button>
                      ) : (
                        <span className="italic text-app-muted">
                          No requiere soporte
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-xs italic text-app-muted">
            Esta actividad no tiene soportes registrados
          </p>
        )}
      </div>

      <div className="flex justify-end bg-app-card px-4 py-3">
        <button
          type="button"
          onClick={() => handleClickActividad(documentId, actividad.uuid)}
          className="inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2 text-xs font-bold text-white hover:bg-teal-dark"
        >
          <FaClipboardList /> Seguimiento
        </button>
      </div>
    </div>
  );
};

export default ActividadCard;

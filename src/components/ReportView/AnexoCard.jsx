import React from "react";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import styles from "./ReporView.module.css";
import EventoTable from "./EventoTable";
import ProductosCell from "./ProductosCell";
import { CustomRoles } from "../Login/constant";
import { SIN_DATO } from "./utils";

const AnexoCard = ({
  row,
  index,
  usuario,
  filterValue,
  operatorFilterValue,
  onEdit,
  onSoporte,
  onActividad,
  handleToggle,
  openIndex,
}) => {
  const anio = row?.anexo_tecnico_date?.slice(0, 4);

  // 2025 reporta hogares beneficiarios; 2026 en adelante, población a intervenir
  const esAnexo2025 = anio === "2025";
  const poblacion = (evento) =>
    (esAnexo2025
      ? evento?.territorializacion?.numero_hogares
      : evento?.territorializacion?.numero_pobalcion_intervenir) ?? SIN_DATO;

  return (
    <div
      key={index}
      class="bg-app-card mb-3 mx-7  border rounded-lg shadow-sm overflow-hidden"
    >
      <div
        class="flex items-center justify-between py-3 px-5 text-white cursor-pointer bg-navy"
        onClick={() => handleToggle(index)}
      >
        <div class="flex items-center gap-3">
          <span class="bg-yellow-brand text-amber-950 font-semibold text-sm py-1 px-2 rounded-3xl">
            ID {row.id}
          </span>
          <span class="text-base">Anexo</span>
          <span class="text-sm text-[#c9d6e4] ml-1">
            {row?.eventos?.[0]?.territorializacion?.municipios?.[0]?.label ||
              SIN_DATO}{" "}
            · {anio}
          </span>
        </div>
        <div class="flex items-center gap-3">
          {usuario === CustomRoles.REFERENTE_INSTITUTO && (
            <button class={styles.edit_button} onClick={() => onEdit(row)}>
              <FaEdit />
            </button>
          )}

          <span
            class={`inline-block transform transition-transform duration-200 ${openIndex === index ? "rotate-180" : "rotate-0"}`}
          >
            &#9660;
          </span>
        </div>
      </div>
      {openIndex === index && (
        <div class="overflow-y-auto transition-all duration-500 ease-in-out animate-fadeIn">
          <table class="w-full min-w-[1400px] border-collapse text-xs">
            <thead>
              <tr>
                <th class="bg-teal-dark">ID</th>
                <th>Año Anexo</th>
                <th>Nodo - Municipio Priorizado</th>
                <th>Operador Pic</th>
                <th>Código - Nombre de Territorio APS</th>
                <th>Código Micro-Territorio</th>
                <th>
                  {esAnexo2025
                    ? "Total Hogares Beneficiarios"
                    : "N° Población a Intervenir"}
                </th>
                <th>Equipo Operativo</th>
                <th>Perfil Profesional</th>
                <th>Perfil Operativo</th>
                <th>Proyecto IDSN Responsable</th>
                <th>Descripción Evento</th>
                <th>Nombre del Indicador</th>
                <th>Meta Indicador</th>
                <th>Ejes Estratégicos</th>
                <th>Líneas Operativas</th>
                <th class="bg-teal-dark">Productos</th>
              </tr>
            </thead>
            <tbody>
              {row?.eventos?.map((evento) => (
                <tr key={`${index}-${evento.id}`}>
                  <td>{evento.id}</td>
                  <td>{anio}</td>
                  <td>
                    {evento?.territorializacion?.municipios?.length > 0
                      ? evento.territorializacion.municipios
                          .map((muni) => muni.label)
                          .join(", ")
                      : SIN_DATO}
                  </td>
                  <td>{evento?.operador_pic?.operador_pic || SIN_DATO}</td>
                  <td>{evento?.territorializacion?.territorio || SIN_DATO}</td>
                  <td>
                    {evento?.territorializacion?.microterritorio || SIN_DATO}
                  </td>
                  <td>{poblacion(evento)}</td>
                  <td>{evento?.equipo || SIN_DATO}</td>
                  <td>{evento?.perfiles_profesional || SIN_DATO}</td>
                  <td>{evento?.perfil_operativo || SIN_DATO}</td>
                  <td>{evento?.proyectos_idsn?.proyecto || SIN_DATO}</td>
                  <td>{evento?.descripcion || SIN_DATO}</td>
                  <td>{evento?.indicador_evento || SIN_DATO}</td>
                  <td>{evento?.meta_indicador_evento || SIN_DATO}</td>
                  <td>
                    {evento?.ejes_estrategicos?.length > 0
                      ? evento.ejes_estrategicos.map((eje) => (
                          <span
                            key={eje.id}
                            className="inline-block bg-app-bg border rounded-2xl text-[11px] py-0.5 px-2 mr-1 mb-1"
                          >
                            {eje.nombre}
                          </span>
                        ))
                      : SIN_DATO}
                  </td>
                  <td>{evento?.lineas_operativa?.nombre || SIN_DATO}</td>
                  <td class="whitespace-nowrap">
                    <ProductosCell
                      evento={evento}
                      anexoId={row.id}
                      documentId={row.documentId}
                      anexoDate={row.anexo_tecnico_date}
                      usuario={usuario}
                      onSoporte={onSoporte}
                      onActividad={onActividad}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnexoCard;

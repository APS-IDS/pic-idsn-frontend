import React from "react";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import styles from "./ReporView.module.css";
import EventoTable from "./EventoTable";
import { CustomRoles } from "../Login/constant";

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
  return (
    <div key={index} class="bg-app-card mb-3 mx-7  border rounded-lg shadow-sm overflow-hidden">
      <div class="flex items-center justify-between py-3 px-5 text-white cursor-pointer bg-navy" onClick={() => handleToggle(index)}>
        <div class="flex items-center gap-3">
          <span class="bg-yellow-brand text-amber-950 font-semibold text-sm py-1 px-2 rounded-3xl">ID {row.id}</span>
          <span class="text-base">Anexo</span>
          <span class="text-sm text-[#c9d6e4] ml-1">{row.eventos[0]?.territorializacion.municipios[0].label} · {row.anexo_tecnico_date.split('-')[0]}</span>
        </div>
        <div>
          {usuario === CustomRoles.REFERENTE_INSTITUTO && (
            <button class={styles.edit_button} onClick={() => onEdit(row)}>
              <FaEdit /> Editar anexo
            </button>
          )}

          <span class={`inline-block transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}>
            &#9660;
          </span>
        </div>

      </div>
      {openIndex === index && (
        <div class="overflow-auto transition-all duration-500 ease-in-out animate-fadeIn">
          <table class="w-full min-w-[1400px] border-collapse text-xs">
            <thead>
              <tr>
                <th class="bg-teal-dark">ID</th>
                <th>Año Anexo</th>
                <th>Nodo - Municipio Priorizado</th>
                <th>Operador Pic</th>
                <th>Código - Nombre de Territorio APS</th>
                <th>Código Micro-Territorio</th>
                <th>N° Población a Intervenir</th>
                <th>Equipo Operativo</th>
                <th>Perfil Profesional</th>
                <th>Perfil Operativo</th>
                <th>Proyecto IDSN Responsable</th>
                <th>Descripción Evento</th>
                <th>Nombre del Indicador</th>
                <th>Meta Indicador</th>
                <th>Ejes Estratégicos</th>
                <th>Líneas Operativas</th>
                <th class="bg-teal-dark">Acciones</th>
              </tr>
            </thead>
            <tbody>

              {row?.eventos?.map((evento) => (
                <tr key={`${index}-${evento.id}`}>
                  <td class="id-col">000123</td>
                  <td>2025</td>
                  <td>Chachagüí (Centro)</td>
                  <td>E.S.E. Centro Hospital Luis Antonio Montero Potosí</td>
                  <td>Código - Nombre de Territorio APS</td>
                  <td>Código Micro-Territorio</td>
                  <td>4</td>
                  <td>Equipos básicos en salud</td>
                  <td>Perfil Profesional</td>
                  <td>Perfil Operativo</td>
                  <td>Medicamentos-Prestación de servicios de salud con calidad para la paz</td>
                  <td>Descripción Evento</td>
                  <td>Nombre del Indicador</td>
                  <td>Meta Indicador</td>
                  <td><span class="chip">Pueblos y comunidades étnicas</span><span class="chip">Mujeres</span><span class="chip">Sectores LGBTIQ+</span></td>
                  <td>Cuidado de la salud en el territorio</td>
                  <td class="actions-col">
                    <a class="action-btn" href="detalle-anexo.html?id=000123" onclick="event.stopPropagation();verDetalle(event,'000123')">
                      <svg viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
                      Ver detalle
                    </a>
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

import React from "react";
import { FaEdit } from "react-icons/fa";
import styles from "./ReporView.module.css";
import ProductosCell from "./ProductosCell";
import { CustomRoles } from "../Login/constant";
import { SIN_DATO } from "./utils";

const AnexoCard = ({
  row,
  index,
  usuario,
  onEdit,
  onSoporte,
  handleToggle,
  openIndex,
}) => {
  const anio = row?.anexo_tecnico_date?.slice(0, 4);

  return (
    <div
      key={index}
      className="bg-app-card mb-3 mx-7  border rounded-lg shadow-sm overflow-hidden"
    >
      <div
        className="flex items-center justify-between py-3 px-5 text-white cursor-pointer bg-navy"
        onClick={() => handleToggle(index)}
      >
        <div className="flex items-center gap-3">
          <span className="bg-yellow-brand text-amber-950 font-semibold text-sm py-1 px-2 rounded-3xl">
            ID {row.id}
          </span>
          <span className="text-base">Anexo</span>
          <span className="text-sm text-[#c9d6e4] ml-1">
            {row?.eventos?.[0]?.territorializacion?.municipios?.[0]?.label ||
              SIN_DATO}{" "}
            · {anio}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {usuario === CustomRoles.REFERENTE_INSTITUTO && (
            <button className={styles.edit_button} onClick={() => onEdit(row)}>
              <FaEdit />
            </button>
          )}

          <span
            className={`inline-block transform transition-transform duration-200 ${openIndex === index ? "rotate-180" : "rotate-0"}`}
          >
            &#9660;
          </span>
        </div>
      </div>
      {openIndex === index && (
        <div className="overflow-y-auto transition-all duration-500 ease-in-out animate-fadeIn">
          <table className="w-full min-w-[1400px] border-collapse text-xs">
            <thead>
              <tr>
                <th className="bg-teal-dark">ID</th>
                <th>Año Anexo</th>
                <th>Nodo - Municipio Priorizado</th>
                <th>Operador Pic</th>
                <th>Proyecto IDSN Responsable</th>
                <th>Descripción Evento</th>
                <th>Nombre del Indicador</th>
                <th>Meta Indicador</th>
                <th className="bg-teal-dark">Productos</th>
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
                  <td>{evento?.proyectos_idsn?.proyecto || SIN_DATO}</td>
                  <td>{evento?.descripcion || SIN_DATO}</td>
                  <td>{evento?.indicador_evento || SIN_DATO}</td>
                  <td>{evento?.meta_indicador_evento || SIN_DATO}</td>
                  <td className="whitespace-nowrap">
                    <ProductosCell
                      evento={evento}
                      anexoId={row.id}
                      documentId={row.documentId}
                      usuario={usuario}
                      onSoporte={onSoporte}
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

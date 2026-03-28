import React from "react";
import { FaEdit } from "react-icons/fa";
import styles from "./ReporView.module.css";
import EventoTable from "./EventoTable";

const AnexoCard = ({
  row,
  index,
  usuario,
  filterValue,
  operatorFilterValue,
  onEdit,
  onSoporte,
  onActividad,
}) => {
  return (
    <div className={styles.anexoContainer}>
      <div className={styles.anexoHeader}>
        <h4>Anexo</h4>
        {usuario === "referente_instituto" && (
          <button className={styles.edit_button} onClick={() => onEdit(row)}>
            <FaEdit /> Editar anexo
          </button>
        )}
      </div>

      {row.eventos.map((evento) => (
        <EventoTable
          key={`${index}-${evento.id}`}
          evento={evento}
          row={row}
          index={index}
          usuario={usuario}
          filterValue={filterValue}
          operatorFilterValue={operatorFilterValue}
          onSoporte={onSoporte}
          onActividad={onActividad}
        />
      ))}
    </div>
  );
};

export default AnexoCard;

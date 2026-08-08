import React, { useState } from "react";
import ProductosModal from "./ProductosModal";

/**
 * Celda de la columna "Productos": muestra el conteo de productos del evento y
 * abre el modal con el detalle (actividades, soportes y seguimiento).
 */
const ProductosCell = ({
  evento,
  anexoId,
  documentId,
  anexoDate,
  usuario,
  onSoporte,
  onActividad,
}) => {
  const [abierto, setAbierto] = useState(false);
  const productos = evento?.productos ?? [];

  if (productos.length === 0) {
    return <span className="text-xs italic text-app-muted">Sin productos</span>;
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={abierto}
        onClick={(event) => {
          event.stopPropagation();
          setAbierto(true);
        }}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-teal bg-teal-light px-3 py-1.5 text-xs font-bold text-teal-dark hover:bg-teal hover:text-white"
      >
        <span>
          {productos.length}{" "}
          {productos.length === 1 ? "producto" : "productos"}
        </span>
        <span
          aria-hidden="true"
          className={`text-[10px] transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
        >
          &#9660;
        </span>
      </button>

      {abierto && (
        <ProductosModal
          productos={productos}
          eventoId={evento?.id}
          anexoId={anexoId}
          documentId={documentId}
          anexoDate={anexoDate}
          usuario={usuario}
          onSoporte={onSoporte}
          onActividad={onActividad}
          onClose={() => setAbierto(false)}
        />
      )}
    </>
  );
};

export default ProductosCell;

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ActividadCard from "./ActividadCard";
import { SIN_DATO } from "./utils";

const Indicador = ({ indicador }) => (
  <span className="rounded-2xl bg-teal-light px-2.5 py-1 text-[11px] font-semibold text-teal-dark">
    Meta producto: {indicador?.meta_producto ?? SIN_DATO} · Línea base:{" "}
    {indicador?.indicador_linea_base ?? SIN_DATO} · Cantidad:{" "}
    {indicador?.cantidad ?? SIN_DATO}
  </span>
);

const ProductosModal = ({
  productos,
  eventoId,
  anexoId,
  documentId,
  anexoDate,
  usuario,
  onSoporte,
  onClose,
}) => {
  // Cierre con Escape y bloqueo del scroll de fondo mientras el modal está abierto
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const scrollPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = scrollPrevio;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-navy-dark/60 p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Productos del evento"
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-app-card shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 bg-navy px-5 py-4 text-white">
          <div>
            <p className="text-sm font-bold leading-snug">
              Productos del evento {eventoId}
            </p>
            <p className="mt-1 text-xs font-medium text-[#c9d6e4]">
              Anexo ID {anexoId} · {productos.length}{" "}
              {productos.length === 1 ? "producto" : "productos"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="h-7 w-7 flex-shrink-0 rounded-md bg-white/10 text-base leading-none text-white hover:bg-white/25"
          >
            &#10005;
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {productos.map((producto, index) => (
            <section key={producto.id || index} className="mb-5 last:mb-0">
              <p className="text-sm font-bold text-navy">
                {producto?.descripcion || SIN_DATO}
              </p>

              {producto?.problematica_priorizada && (
                <p className="mt-1 text-xs text-app-muted">
                  Problemática priorizada: {producto.problematica_priorizada}
                </p>
              )}

              <div className="my-2 flex flex-wrap gap-2">
                {producto?.indicadores?.map((indicador, i) => (
                  <Indicador key={indicador.id || i} indicador={indicador} />
                ))}
              </div>

              {producto?.actividades?.length > 0 ? (
                producto.actividades.map((actividad, i) => (
                  <ActividadCard
                    key={actividad.id || i}
                    actividad={actividad}
                    documentId={documentId}
                    anexoDate={anexoDate}
                    usuario={usuario}
                    onSoporte={onSoporte}
                  />
                ))
              ) : (
                <p className="text-xs italic text-app-muted">
                  Este producto no tiene actividades registradas
                </p>
              )}
            </section>
          ))}
        </div>

        <div className="flex justify-end border-t border-app-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-app-border px-5 py-2 text-sm font-semibold text-app-muted hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ProductosModal;

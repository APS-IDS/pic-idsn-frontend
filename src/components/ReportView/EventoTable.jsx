import React from "react";
import styles from "./ReporView.module.css";
import ProductosSection from "./ProductosSection";

const EventoTable = ({
  evento,
  row,
  index,
  usuario,
  filterValue,
  operatorFilterValue,
  onSoporte,
  onActividad,
}) => {
  const showProductos = (filterValue || operatorFilterValue) !== "";

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Año Anexo</th>
          <th>Nodo - Municipio Priorizado</th>
          <th>Operador Pic</th>
          <th>Código - Nombre de Territorio APS</th>
          <th>Código Micro-Territorio</th>
          <th>Total número de Hogares Beneficiarios</th>
          <th>Equipo Operativo</th>
          <th>Perfil Profesional</th>
          <th>Perfil Operativo</th>
          <th>Proyecto IDSN Responsable</th>
          <th>Descripción Evento</th>
          <th>Nombre del Indicador</th>
          <th>Meta Indicador</th>
          <th>Ejes Estratégicos</th>
          <th>Lineas Operativas</th>
          {showProductos && <th>Productos</th>}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{row?.anexo_tecnico_date?.slice(0, 4)}</td>

          <td>
            <table>
              <tbody>
                {Array.isArray(evento?.territorializacion?.municipios) &&
                evento.territorializacion.municipios.length > 0 ? (
                  evento.territorializacion.municipios.map((muni, i) => (
                    <tr key={i}>
                      <td>{muni.label}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>Informacion sin ingresar</td>
                  </tr>
                )}
              </tbody>
            </table>
          </td>

          <td>{evento?.operador_pic?.operador_pic}</td>
          <td>{evento?.territorializacion?.territorio || ""}</td>
          <td>
            {evento?.territorializacion?.microterritorio || "Falta ingresar "}
          </td>
          <td>
            {evento?.territorializacion?.numero_hogares || "No hay hogares"}
          </td>
          <td>{evento?.equipo}</td>
          <td>{evento?.perfiles_profesional}</td>
          <td>{evento?.perfil_operativo}</td>
          <td>{evento?.proyectos_idsn?.proyecto}</td>
          <td>{evento?.descripcion}</td>
          <td>{evento?.indicador_evento}</td>
          <td>{evento?.meta_indicador_evento}</td>

          <td>
            <table>
              <tbody>
                {evento?.ejes_estrategicos?.map((eje) => (
                  <tr key={eje.id}>
                    <td>{eje.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>

          <td>{evento?.lineas_operativa?.nombre}</td>

          {showProductos && (
            <td>
              <ProductosSection
                productos={evento.productos}
                documentId={row.documentId}
                usuario={usuario}
                onSoporte={onSoporte}
                onActividad={onActividad}
              />
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default EventoTable;

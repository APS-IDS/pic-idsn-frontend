import React from "react";
import { FaClipboardList, FaPaperclip } from "react-icons/fa";
import styles from "./ReporView.module.css";

const ProductosSection = ({
  productos,
  documentId,
  usuario,
  onSoporte,
  onActividad,
  anexo_year,
}) => {
  //console.log("productos", productos);
  return (
    <table>
      <tbody>
        {productos.map((producto) => (
          <tr key={producto.id || producto.descripcion}>
            <td colSpan="4">
              <table className={styles.subTable}>
                <thead>
                  <tr>
                    {anexo_year == "2026-01-01" && (
                      <th>Problematica Priorizada</th>
                    )}
                    <th>Descripcion del producto</th>

                    <th>Indicadores</th>
                    <th>Actividades</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {anexo_year == "2026-01-01" && (
                      <td>{producto.problematica_priorizada}</td>
                    )}

                    <td>{producto.descripcion}</td>
                    {/* Indicadores */}
                    <td>
                      <table className={styles.subTable}>
                        <thead>
                          <tr>
                            <th>Indicador linea base</th>
                            <th>Cantidad</th>
                            <th>Meta Producto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {producto.indicadores.map((indicador, index) => (
                            <tr key={indicador.id || index}>
                              <td>{indicador.indicador_linea_base}</td>
                              <td>{indicador.cantidad}</td>
                              <td>{indicador.meta_producto}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>

                    {/* Actividades */}
                    <td>
                      {producto.actividades.map((actividad, index) => (
                        <table
                          key={actividad.id || index}
                          className={styles.subTable}
                        >
                          <thead>
                            <tr>
                              <th>Descripción de Actividad</th>
                              <th>Cantidad a Ejecutar</th>
                              <th>Unidad de Medida</th>
                              <th>Entornos</th>
                              <th>Tecnologías</th>
                              {anexo_year == "2026-01-01" && (
                                <th>Curso de Vida</th>
                              )}

                              <th>Población Sujeto</th>
                              <th>Soportes</th>
                              <th>Código Cups</th>
                              {anexo_year == "2025-01-01" && (
                                <th>Valor Unitario</th>
                              )}
                              {anexo_year == "2026-01-01" && (
                                <th>Valor Unitario</th>
                              )}
                              <th>Valor Total</th>
                              <th>Cronograma</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{actividad.descripcion}</td>
                              <td>{actividad.cantidad_a_ejecutar}</td>
                              <td>{actividad.unidad_medida}</td>

                              {/* Entornos */}
                              <td>
                                <table>
                                  <tbody>
                                    {actividad.entornos.map((entorno) => (
                                      <tr key={entorno.id}>
                                        <td>{entorno.nombre}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>

                              {/* Tecnologías */}
                              <td>
                                <table>
                                  <tbody>
                                    {actividad.tecnologias.map((tecno, i) => (
                                      <tr key={tecno.id || i}>
                                        <td>{tecno.nombre}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                              {/* Curso de vida */}

                              {anexo_year == "2026-01-01" && (
                                <td>
                                  <table>
                                    <tbody>
                                      {actividad.curso_de_vida.map(
                                        (curso, i) => (
                                          <tr key={curso.id || i}>
                                            <td>{curso.nombre}</td>
                                          </tr>
                                        ),
                                      )}
                                    </tbody>
                                  </table>
                                </td>
                              )}

                              {/* Poblaciones */}
                              <td>
                                <table>
                                  <tbody>
                                    {actividad.poblaciones.map(
                                      (poblacion, i) => (
                                        <tr key={poblacion.id || i}>
                                          <td>{poblacion.nombre}</td>
                                        </tr>
                                      ),
                                    )}
                                  </tbody>
                                </table>
                              </td>

                              {/* Soportes */}
                              <td>
                                <table className={styles.subTable}>
                                  <thead>
                                    <tr>
                                      <th>Tipo Soporte</th>
                                      <th>Descripción</th>
                                      <th>Cantidad</th>
                                      {usuario === "operador" && (
                                        <th>Acciones</th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {actividad.soportes.map((soporte, i) => (
                                      <tr key={soporte.id || i}>
                                        <td>{soporte.tipo}</td>
                                        <td>{soporte.descripcion}</td>
                                        <td>{soporte.cantidad}</td>
                                        {(soporte.cantidad ?? 0) > 0 &&
                                          usuario === "operador" && (
                                            <td>
                                              <button
                                                onClick={() =>
                                                  onSoporte(
                                                    documentId,
                                                    soporte.uuid,
                                                  )
                                                }
                                                className={styles.edit_button}
                                              >
                                                <FaPaperclip /> Soporte
                                              </button>
                                            </td>
                                          )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>

                              <td>{actividad.cups.codigo}</td>

                              {/* Valor Unitario */}
                              {anexo_year == "2025-01-01" && (
                                <td>
                                  <table>
                                    <tbody>
                                      <tr>
                                        <td>
                                          {actividad.valor_unitario
                                            ? new Intl.NumberFormat(
                                                "es-ES",
                                              ).format(actividad.valor_unitario)
                                            : ""}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              )}
                              {anexo_year == "2026-01-01" && (
                                <td>
                                  <table className={styles.subTable}>
                                    <thead>
                                      <tr>
                                        <th>Costos Directos</th>
                                        <th>Costos Indirectos</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>{actividad.costos_directos}</td>
                                        <td>{actividad.costos_indirectos}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              )}

                              {/* Valor Total */}
                              <td>
                                <div
                                  style={{
                                    border: "1px solid #c0bcbc",
                                    padding: "5px",
                                    display: "inline-block",
                                  }}
                                >
                                  {actividad.valor_total
                                    ? new Intl.NumberFormat("es-ES").format(
                                        actividad.valor_total,
                                      )
                                    : ""}
                                </div>
                              </td>

                              {/* Cronograma */}
                              <td>
                                <table className={styles.subTable}>
                                  <thead>
                                    <tr>
                                      <th>Mes</th>
                                      <th>Porcentaje</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {actividad.cronograma.map((crono, i) =>
                                      Object.entries(crono).map(
                                        ([mes, porcentaje]) =>
                                          porcentaje > 0 ? (
                                            <tr key={`${i}-${mes}`}>
                                              <td>{mes}</td>
                                              <td>{porcentaje}%</td>
                                            </tr>
                                          ) : null,
                                      ),
                                    )}
                                  </tbody>
                                </table>
                              </td>

                              {/* Acciones */}
                              <td>
                                <button
                                  className={styles.seguimiento_button}
                                  onClick={() => onActividad(documentId, actividad.uuid)}
                                >
                                  <FaClipboardList
                                    style={{ marginRight: "5px" }}
                                  />
                                  Seguimiento
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductosSection;

import React, { useState } from "react";
import styles from "./ActivityItem.module.css";
import Select from "react-select";
import Swal from "sweetalert2";
import { NumericFormat } from "react-number-format";

const ActivityItem = ({
  activity,
  index,
  expanded,
  toggleExpanded,
  handleActivityChange,
  handleRemoveActivity,
  handleAddActivity,
  entornos,
  tecnologias,
  poblaciones,
  soportes,
  cups,
}) => {
  const options = {
    tipo_soporte: soportes,
    meses: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sept",
      "Oct",
      "Nov",
      "Dic",
    ],
  };

  const custom_styles = {
    control: (base) => ({
      ...base,
      minWidth: "200px", // Ajusta el ancho mínimo
      //maxWidth: "400px", // Opcional, limita el ancho máximo
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5, // Asegura que el menú no se superponga
    }),
    option: (base) => ({
      ...base,
      whiteSpace: "nowrap", // Evita que el texto se parta
    }),
    multiValueLabel: (base) => ({
      ...base,
      whiteSpace: "normal", // Permite que las etiquetas ocupen más espacio
    }),
  };

  const custom_styles_cups = {
    ...custom_styles,
    control: (base) => ({
      ...base,
      minWidth: "500px",
    }),
  };

  const handleCronogramaChange = (value, key, itemIndex) => {
    const updatedCronograma = [...(activity.cronograma || [])];
    console.log("cronograma", updatedCronograma);

    // Asegurarse de que el elemento existe
    if (!updatedCronograma[itemIndex]) {
      updatedCronograma[itemIndex] = {
        mes: options.meses[itemIndex],
        peso: "",
      };
    }

    // Actualizar el valor correspondiente
    updatedCronograma[itemIndex][key] = value;

    handleActivityChange(
      { target: { name: "cronograma", value: updatedCronograma } },
      index
    );
  };

  // Añadir soporte
  const addSoporte = () => {
    const newSoportes = [
      ...(activity.array_soportes || []),
      { tipo_soporte: "", descripcion_soporte: "", cantidad_soporte: "" },
    ];
    handleActivityChange(
      { target: { name: "array_soportes", value: newSoportes } },
      index
    );
  };

  // Eliminar soporte
  const removeSoporte = (soporteIndex) => {
    const newSoportes = activity.array_soportes.filter(
      (_, idx) => idx !== soporteIndex
    );
    handleActivityChange(
      { target: { name: "array_soportes", value: newSoportes } },
      index
    );
  };

  // Cambiar soporte
  const handleSoporteChange = (e, soporteIndex) => {
    const { name, value } = e.target;
    const newSoportes = [...activity.array_soportes];
    console.log("soportes", newSoportes);
    newSoportes[soporteIndex][name] = value;
    handleActivityChange(
      { target: { name: "array_soportes", value: newSoportes } },
      index
    );
  };

  // Obtener todas las opciones seleccionadas para deshabilitarlas

  const selectedOptions = activity.array_soportes?.map(
    (soporte) => soporte.tipo_soporte
  );

  // const formatNumberWithCommas = (number) => {
  //   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  // };

  const handle_remove_soporte = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el soporte ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        removeSoporte(index);
        Swal.fire("Eliminado", "El soporte ha sido eliminado.", "success");
      }
    });
  };

  const handle_remove_actividad = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la actividad",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveActivity(index);
        Swal.fire("Eliminada", "La actividad ha sido borrada", "success");
      }
    });
  };

  const renderCronogramaField = () => {
    const allMonths = options.meses;

    // Inicializa el cronograma si no existe
    const cronograma = allMonths.map((mes) => {
      const existing = (activity.cronograma || []).find(
        (item) => item.mes === mes
      );
      return existing || { mes, peso: "" }; // Crea un item vacío si no existe
    });

    return (
      <div>
        {/* <label>Cronograma</label> */}
        <div className={styles.cronogramaGrid}>
          {cronograma.map((item, itemIndex) => (
            <div key={item.mes} className={styles.cronogramaItem}>
              <strong>{item.mes}</strong>
              <input
                type="number"
                placeholder="%"
                value={item.peso === 0 ? "" : item.peso}
                onChange={(e) =>
                  handleCronogramaChange(
                    e.target.value,
                    "peso",
                    itemIndex,
                    index
                  )
                }
                min="0"
                max="100"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <li className={styles.activityItem}>
      <div
        className={styles.activityHeader}
        onClick={() => toggleExpanded(index)}
      >
        <strong>Actividad {index + 1}</strong>

        {index > 0 && (
          <button
            type="button"
            className={styles.removeButton}
            onClick={(e) => {
              e.stopPropagation();
              // handleRemoveActivity(index);
              handle_remove_actividad(index);
            }}
          >
            -
          </button>
        )}

        <button
          className={styles.buttonMain_añadir}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAddActivity();
          }}
        >
          +
        </button>
      </div>
      {expanded && (
        <div className={styles.activityDetails}>
          <table>
            <thead>
              <tr>
                <th>Descripción Actividad</th>
                <th>Cantidad</th>
                <th>Unidad de Medida</th>
                <th>Entornos</th>
                <th>Tecnologías</th>
                <th>Población Sujeto</th>
                <th>Soportes</th>
                <th>Código Cups</th>
                <th>Valor Unitario</th>
                <th>Valor Total</th>
                <th>Cronograma</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className={styles.contenedor_actividad}>
                    <textarea
                      type="text"
                      name="descripcion_actividad"
                      placeholder="Máximo numero de caracteres 400"
                      maxLength={400}
                      value={activity.descripcion_actividad || ""}
                      onChange={(e) => handleActivityChange(e, index)}
                      className={styles.textarea_actividad}
                    />
                  </div>
                  <p>
                    {activity.descripcion_actividad?.length || 0} / 400
                    caracteres
                  </p>
                </td>
                <td>
                  <div className={styles.inputContainer}>
                    <input
                      type="number"
                      name="cantidad"
                      value={activity.cantidad}
                      onChange={(e) => handleActivityChange(e, index)}
                      className={styles.inputGlobal}
                      min="0"
                    />
                  </div>
                </td>
                <td>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      name="unidad_medida"
                      value={activity.unidad_medida}
                      onChange={(e) => handleActivityChange(e, index)}
                      className={styles.inputGlobal}
                    />
                  </div>
                </td>
                <td>
                  <Select
                    isMulti
                    name="entorno"
                    options={entornos.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    value={entornos
                      .map((option) => ({ value: option, label: option }))
                      .filter((option) =>
                        activity.entorno.includes(option.value)
                      )}
                    onChange={(selectedOptions) =>
                      handleActivityChange(
                        {
                          target: {
                            name: "entorno",
                            value: selectedOptions.map(
                              (option) => option.value
                            ),
                          },
                        },
                        index
                      )
                    }
                    placeholder="Seleccionar Entornos"
                    styles={custom_styles}
                  />
                </td>
                <td>
                  <Select
                    isMulti
                    name="tecnologia"
                    options={tecnologias.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    value={tecnologias
                      .map((option) => ({ value: option, label: option }))
                      .filter((option) =>
                        activity.tecnologia.includes(option.value)
                      )}
                    onChange={(selectedOptions) =>
                      handleActivityChange(
                        {
                          target: {
                            name: "tecnologia",
                            value: selectedOptions.map(
                              (option) => option.value
                            ),
                          },
                        },
                        index
                      )
                    }
                    placeholder="Seleccionar Tecnologia"
                    styles={custom_styles_cups}
                  />
                </td>
                <td>
                  <Select
                    isMulti
                    name="poblacion_sujeto"
                    options={poblaciones.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    value={poblaciones
                      .map((option) => ({ value: option, label: option }))
                      .filter((option) =>
                        activity.poblacion_sujeto.includes(option.value)
                      )}
                    onChange={(selectedOptions) =>
                      handleActivityChange(
                        {
                          target: {
                            name: "poblacion_sujeto",
                            value: selectedOptions.map(
                              (option) => option.value
                            ),
                          },
                        },
                        index
                      )
                    }
                    placeholder="Seleccionar Poblacion"
                    styles={custom_styles}
                  />
                </td>
                <td>
                  <div className={styles.soporte_div}>
                    <table>
                      <thead>
                        <tr>
                          <th>Tipo Soporte</th>
                          <th>Descripción Soporte</th>
                          <th>Cantidad</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activity.array_soportes?.map(
                          (soporte, soporteIndex) => (
                            <tr key={soporteIndex}>
                              <td>
                                <Select
                                  className={styles.soporte_select}
                                  value={
                                    soporte.tipo_soporte
                                      ? {
                                          label: soporte.tipo_soporte,
                                          value: soporte.tipo_soporte,
                                        }
                                      : null
                                  }
                                  onChange={(selectedOption) =>
                                    handleSoporteChange(
                                      {
                                        target: {
                                          name: "tipo_soporte",
                                          value: selectedOption?.value,
                                        },
                                      },
                                      soporteIndex
                                    )
                                  }
                                  options={options.tipo_soporte.map(
                                    (option) => ({
                                      label: option,
                                      value: option,
                                      isDisabled:
                                        selectedOptions.includes(option) &&
                                        option !== soporte.tipo_soporte,
                                    })
                                  )}
                                  isOptionDisabled={(option) =>
                                    option.isDisabled
                                  }
                                  placeholder="Seleccionar Soporte"
                                />
                              </td>
                              <td>
                                <textarea
                                  type="text"
                                  name="descripcion_soporte"
                                  value={soporte.descripcion_soporte || ""}
                                  onChange={(e) =>
                                    handleSoporteChange(e, soporteIndex)
                                  }
                                  placeholder="Descripción Soporte"
                                  className={styles.textarea}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  name="cantidad_soporte"
                                  value={soporte.cantidad_soporte}
                                  onChange={(e) =>
                                    handleSoporteChange(e, soporteIndex)
                                  }
                                  placeholder="Cantidad"
                                  className={styles.soporte_input}
                                  min="0"
                                />
                              </td>
                              <td>
                                <div className={styles.contenedor_boton}>
                                  {soporteIndex > 0 && (
                                    <button
                                      className={styles.removeButton}
                                      type="button"
                                      // onClick={() =>
                                      //   removeSoporte(soporteIndex)
                                      // }
                                      onClick={() =>
                                        handle_remove_soporte(soporteIndex)
                                      }
                                    >
                                      -
                                    </button>
                                  )}
                                  <button
                                    className={styles.buttonMain_añadir}
                                    type="button"
                                    onClick={addSoporte}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </td>
                <td>
                  <Select
                    name="codigo_cups"
                    options={cups.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    value={
                      activity.codigo_cups
                        ? {
                            value: activity.codigo_cups,
                            label: activity.codigo_cups,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleActivityChange(
                        {
                          target: {
                            name: "codigo_cups",
                            value: selectedOption ? selectedOption.value : null,
                          },
                        },
                        index
                      )
                    }
                    placeholder="Seleccionar Cups"
                    styles={custom_styles_cups}
                  />
                </td>

                {/* <td>
                  <div className={styles.input_valor_container}>
                    <input
                      type="text"
                      name="valor_unitario"
                      value={
                        activity.valor_unitario
                          ? new Intl.NumberFormat("es-ES").format(
                              activity.valor_unitario
                            )
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\./g, ""); // Elimina puntos
                        handleActivityChange(
                          { target: { name: e.target.name, value: rawValue } },
                          index
                        );
                      }}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) && // Solo números
                          e.key !== "Backspace" && // Permitir borrar
                          e.key !== "Tab" && // Permitir Tab
                          e.key !== "ArrowLeft" && // Permitir flecha izquierda
                          e.key !== "ArrowRight" && // Permitir flecha derecha
                          e.key !== "Delete" // Permitir tecla Delete
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className={styles.input_valor}
                      min="0"
                    />
                  </div>
                </td> */}

                <td>
                  <div className={styles.input_valor_container}>
                    <NumericFormat
                      name="valor_unitario"
                      value={activity.valor_unitario}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2} // Número de decimales permitidos
                      fixedDecimalScale={true} // Mantener siempre el número de decimales
                      onValueChange={(values) => {
                        const { formattedValue, value } = values;
                        handleActivityChange(
                          { target: { name: "valor_unitario", value } },
                          index
                        );
                      }}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9,]/.test(e.key) && // Solo números y coma
                          e.key !== "Backspace" && // Permitir borrar
                          e.key !== "Tab" && // Permitir Tab
                          e.key !== "ArrowLeft" && // Permitir flecha izquierda
                          e.key !== "ArrowRight" && // Permitir flecha derecha
                          e.key !== "Delete" // Permitir tecla Delete
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className={styles.input_valor}
                      min="0"
                    />
                  </div>
                </td>
                <td>
                  <div className={styles.input_valor_container}>
                    <NumericFormat
                      name="valor_total"
                      value={activity.valor_total}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2} // Número de decimales permitidos
                      fixedDecimalScale={true} // Mantener siempre el número de decimales
                      onValueChange={(values) => {
                        const { formattedValue, value } = values;
                        handleActivityChange(
                          { target: { name: "valor_total", value } },
                          index
                        );
                      }}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9,]/.test(e.key) && // Solo números y coma
                          e.key !== "Backspace" && // Permitir borrar
                          e.key !== "Tab" && // Permitir Tab
                          e.key !== "ArrowLeft" && // Permitir flecha izquierda
                          e.key !== "ArrowRight" && // Permitir flecha derecha
                          e.key !== "Delete" // Permitir tecla Delete
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className={styles.input_valor}
                      min="0"
                    />
                  </div>
                </td>

                {/* 
                <td>
                  <div className={styles.input_valor_container}>
                    <input
                      type="text"
                      name="valor_total"
                      // value={new Intl.NumberFormat("es-ES").format(
                      //   activity.valor_total
                      // )}
                      value={
                        activity.valor_total
                          ? new Intl.NumberFormat("es-ES").format(
                              activity.valor_total
                            )
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\./g, ""); // Elimina puntos
                        handleActivityChange(
                          { target: { name: e.target.name, value: rawValue } },
                          index
                        );
                      }}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) && // Solo números
                          e.key !== "Backspace" && // Permitir borrar
                          e.key !== "Tab" && // Permitir Tab
                          e.key !== "ArrowLeft" && // Permitir flecha izquierda
                          e.key !== "ArrowRight" && // Permitir flecha derecha
                          e.key !== "Delete" // Permitir tecla Delete
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className={styles.input_valor}
                      min="0"
                    />
                  </div>
                </td> */}

                <td>{renderCronogramaField()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </li>
  );
};

export default ActivityItem;

import React from "react";
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
  entornos,
  tecnologias,
  poblaciones,
  soportes,
  cups,
  cursos_vida,
  anexoYear,
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

  const handleCronogramaChange = (value, key, itemIndex) => {
    const updatedCronograma = [...(activity.cronograma || [])];
    // console.log("cronograma", updatedCronograma);

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
      index,
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
      index,
    );
  };

  // Eliminar soporte
  const removeSoporte = (soporteIndex) => {
    const newSoportes = activity.array_soportes.filter(
      (_, idx) => idx !== soporteIndex,
    );
    handleActivityChange(
      { target: { name: "array_soportes", value: newSoportes } },
      index,
    );
  };

  // Cambiar soporte
  const handleSoporteChange = (e, soporteIndex) => {
    const { name, value } = e.target;
    const newSoportes = [...activity.array_soportes];

    newSoportes[soporteIndex][name] = value;
    handleActivityChange(
      { target: { name: "array_soportes", value: newSoportes } },
      index,
    );
  };

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
        (item) => item.mes === mes,
      );
      return existing || { mes, peso: "" }; // Crea un item vacío si no existe
    });

    return (
      <div className="col-span-3">
        <div className="col-span-3 grid-cols-3 flex gap-4 items-start justify-between mb-3">
          <h2 className="text-lg font-semibold text-navy col-span-3 text-start ">Cronograma</h2>
        </div>

        {/* <label>Cronograma</label> */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {cronograma.map((item, itemIndex) => (
            <div key={item.mes} className=" bg-teal-light rounded-lg  px-2 py-3 text-center">
              <label className="block font-bold text-xs text-teal-dark mb-1">{item.mes}</label>
              <input
                type="number"
                placeholder="%"
                value={item.peso === 0 ? "" : item.peso}
                onChange={(e) =>
                  handleCronogramaChange(
                    e.target.value,
                    "peso",
                    itemIndex,
                    index,
                  )
                }
                min="0"
                max="100"
                className="w-full px-1 py-1 text-center border border-bg-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div key={index} className="bg-app-card border border-app-border rounded-xl mb-4 overflow-hidden shadow-sm">
      <div className="bg-teal-600 text-app-card py-3 px-4 flex justify-between items-center font-semibold">
        Actividad #{index + 1}
        <div className="flex items-center gap-4">
          <span
            className={`inline-block transform transition-transform duration-200  cursor-pointer hover:text-red-600`}
            onClick={() => { handle_remove_actividad(index); }}
          >
            &#10005;
          </span>
          <span
            className={`inline-block transform transition-transform duration-200 cursor-pointer ${expanded === true ? "rotate-180" : "rotate-0"}`}
            onClick={() => { toggleExpanded(index); }}
          >
            &#9660;
          </span>
        </div>
      </div>

      {expanded && (<div className="bg-[#f8fafb] py-3 pb-4 px-6">
        <div className="grid sm:grid-cols-3 gap-4 items-start">

          <div className="col-span-3">
            <label className="block text-xs text-app-muted mb-1">DESCRIPCIÓN DE LA ACTIVIDAD</label>
            <textarea
              type="text"
              name="descripcion_actividad"
              maxLength={6000}
              value={activity.descripcion_actividad || ""}
              onChange={(e) => handleActivityChange(e, index)}
              className="w-full p-2 border border-app-border rounded-md text-sm"
            />
            <p className="text-xs text-app-muted">
              {activity.descripcion_actividad?.length || 0} / 6000 caracteres
            </p>
          </div>

          <div>
            <label className="block text-xs text-app-muted mb-1 uppercase">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={activity.cantidad || 0}
              onChange={(e) => handleActivityChange(e, index)}
              className="w-full p-2 border border-app-border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-app-muted mb-1 uppercase">Unidad de Medida</label>
            <input
              type="text"
              name="unidad_medida"
              value={activity.unidad_medida || ""}
              onChange={(e) => handleActivityChange(e, index)}
              className="w-full p-2 border border-app-border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-app-muted mb-1">ENTORNOS</label>
            <Select
              isMulti
              name="entorno"
              value={activity.entorno.map((entorno) => ({
                value: entorno,
                label: entorno,
              }))}
              options={entornos}
              onChange={(selectedOptions) => handleActivityChange(
                {
                  target: {
                    name: "entorno",
                    value: selectedOptions.map(
                      (option) => option.value,
                    ),
                  },
                },
                index,
              )}
              placeholder="Seleccionar Entornos"
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          <div>
            <label className="block text-xs text-app-muted mb-1 uppercase">TECNOLOGíAS</label>
            <Select
              isMulti
              name="tecnologia"
              value={activity.tecnologia.map((tecnologia) => ({
                value: tecnologia,
                label: tecnologia,
              }))}
              options={tecnologias}
              onChange={(selectedOptions) => handleActivityChange(
                {
                  target: {
                    name: "tecnologia",
                    value: selectedOptions.map(
                      (option) => option.value,
                    ),
                  },
                },
                index,
              )}
              placeholder="Seleccionar Tecnologías"
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          {anexoYear == "2026" && (
            <div>
              <label className="block text-xs text-app-muted mb-1 uppercase">CURSOS DE VIDA</label>
              <Select
                isMulti
                name="cursos_vida"
                value={activity?.cursos_vida?.map((cursos) => ({
                  value: cursos,
                  label: cursos,
                }))}
                options={cursos_vida}
                onChange={(selectedOptions) => handleActivityChange(
                  {
                    target: {
                      name: "cursos_vida",
                      value: selectedOptions.map(
                        (option) => option.value,
                      ),
                    },
                  },
                  index,
                )}
                placeholder="Seleccionar Cursos de Vida"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-app-muted mb-1 uppercase">POBLACIÓN SUJETO</label>
            <Select
              isMulti
              name="poblacion_sujeto"
              value={activity.poblacion_sujeto.map((poblacion) => ({
                value: poblacion,
                label: poblacion,
              }))}
              options={poblaciones}
              onChange={(selectedOptions) => handleActivityChange(
                {
                  target: {
                    name: "poblacion_sujeto",
                    value: selectedOptions.map(
                      (option) => option.value,
                    ),
                  },
                },
                index,
              )}
              placeholder="Seleccionar Población"
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          <div>
            <label className="block text-xs text-app-muted mb-1 uppercase">CODIGO CUPS</label>
            <Select
              name="codigo_cups"
              options={cups}
              value={activity.codigo_cups
                ? {
                  value: activity.codigo_cups,
                  label: cups.find((option) => option.value === activity.codigo_cups)?.label || activity.codigo_cups,
                }
                : null
              }
              onChange={(selectedOption) => handleActivityChange(
                {
                  target: {
                    name: "codigo_cups",
                    value: selectedOption ? selectedOption.value : null,
                  },
                },
                index,
              )}
              placeholder="Seleccionar Operador"
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          <div className="col-span-3">
            <label className="block text-xs text-app-muted mb-1 uppercase">VALOR TOTAL</label>
            <div>
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
                    index,
                  );
                }}
                onKeyDown={(e) => {
                  const isCtrlCombo = e.ctrlKey || e.metaKey;
                  if (
                    !/[0-9,]/.test(e.key) && // Solo números y coma
                    e.key !== "Backspace" && // Permitir borrar
                    e.key !== "Tab" && // Permitir Tab
                    e.key !== "ArrowLeft" && // Permitir flecha izquierda
                    e.key !== "ArrowRight" && // Permitir flecha derecha
                    e.key !== "Delete" && // Permitir tecla Delete
                    !isCtrlCombo
                  ) {
                    e.preventDefault();
                  }
                }}
                className={styles.input_valor}
                min="0"
              />

            </div>
            {anexoYear == "2025-01-01" && (
              <div>
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
                      index,
                    );
                  }}
                  onKeyDown={(e) => {
                    const isCtrlCombo = e.ctrlKey || e.metaKey;
                    if (
                      !/[0-9,]/.test(e.key) && // Solo números y coma
                      e.key !== "Backspace" && // Permitir borrar
                      e.key !== "Tab" && // Permitir Tab
                      e.key !== "ArrowLeft" && // Permitir flecha izquierda
                      e.key !== "ArrowRight" && // Permitir flecha derecha
                      e.key !== "Delete" &&
                      !isCtrlCombo
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className={styles.input_valor}
                  min="0"
                />
              </div>
            )}

            {anexoYear == "2026-01-01" && (

              <div className="flex gap-2">
                <div className="mt-2">
                  <label className="block text-xs text-app-muted mb-1 uppercase">COSTOS DIRECTOS</label>
                  <NumericFormat
                    name="costo_directo"
                    value={activity.costo_directo}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2} // Número de decimales permitidos
                    fixedDecimalScale={true} // Mantener siempre el número de decimales
                    onValueChange={(values) => {
                      const { formattedValue, value } = values;
                      handleActivityChange(
                        {
                          target: { name: "costo_directo", value },
                        },
                        index,
                      );
                    }}
                    onKeyDown={(e) => {
                      const isCtrlCombo = e.ctrlKey || e.metaKey;
                      if (
                        !/[0-9,]/.test(e.key) && // Solo números y coma
                        e.key !== "Backspace" && // Permitir borrar
                        e.key !== "Tab" && // Permitir Tab
                        e.key !== "ArrowLeft" && // Permitir flecha izquierda
                        e.key !== "ArrowRight" && // Permitir flecha derecha
                        e.key !== "Delete" &&
                        !isCtrlCombo
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className={styles.input_valor}
                    min="0"
                  />
                </div>



                <div className="mt-2">
                  <label className="block text-xs text-app-muted mb-1 uppercase">COSTOS INDIRECTOS</label>
                  <NumericFormat
                    name="costo_indirecto"
                    value={activity.costo_indirecto}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2} // Número de decimales permitidos
                    fixedDecimalScale={true} // Mantener siempre el número de decimales
                    onValueChange={(values) => {
                      const { formattedValue, value } = values;
                      handleActivityChange(
                        {
                          target: {
                            name: "costo_indirecto",
                            value,
                          },
                        },
                        index,
                      );
                    }}
                    onKeyDown={(e) => {
                      const isCtrlCombo = e.ctrlKey || e.metaKey;
                      if (
                        !/[0-9,]/.test(e.key) && // Solo números y coma
                        e.key !== "Backspace" && // Permitir borrar
                        e.key !== "Tab" && // Permitir Tab
                        e.key !== "ArrowLeft" && // Permitir flecha izquierda
                        e.key !== "ArrowRight" && // Permitir flecha derecha
                        e.key !== "Delete" &&
                        !isCtrlCombo
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className={styles.input_valor}
                    min="0"
                  />
                </div>
              </div>
            )}



          </div>

          <div className="col-span-3 grid-cols-3 flex gap-4 items-start justify-between mt-3">
            <h2 className="text-lg font-semibold text-navy col-span-3 text-start ">Soportes</h2>
            <button
              type="button"
              className="flex items-center gap-2 bg-green-brand text-white border-0 py-2 pl-4 pr-3 rounded-3xl border-bg-teal-900 text-sm cursor-pointer hover:bg-teal"
              onClick={() => addSoporte()}
            >
              <span className="">+</span> Agregar soporte
            </button>
          </div>

          {activity.array_soportes?.map(
            (soporte, soporteIndex) => (
              <div className="col-span-3 grid gap-3 items-start bg-teal-light border rounded-lg px-3 py-3 grid-cols-10" key={soporteIndex}>

                <div className="col-span-3">
                  <label className="block text-xs text-app-muted mb-1 uppercase">TIPO DE SOPORTE</label>
                  <Select
                    options={options.tipo_soporte}
                    value={soporte.tipo_soporte
                      ? {
                        value: soporte.tipo_soporte,
                        label: options.tipo_soporte.find((option) => option.value === soporte.tipo_soporte)?.label || soporte.tipo_soporte,
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
                        soporteIndex,
                      )
                    }
                    placeholder="Seleccionar Soporte"
                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-xs text-app-muted mb-1">DESCRIPCIÓN DE SOPORTES</label>
                  <textarea
                    type="text"
                    name="descripcion_soporte"
                    maxLength={200}
                    value={soporte.descripcion_soporte || ""}
                    onChange={(e) => handleSoporteChange(e, soporteIndex)}
                    className="w-full p-2 border border-app-border rounded-md text-sm"
                  />
                  <p className="text-xs text-app-muted">
                    {soporte.descripcion_soporte?.length || 0} / 200 caracteres
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-app-muted mb-1 uppercase">Cantidad</label>
                  <input
                    type="number"
                    name="cantidad_soporte"
                    value={soporte.cantidad_soporte}
                    onChange={(e) =>
                      handleSoporteChange(e, soporteIndex)
                    }
                    placeholder="Cantidad"
                    min="0"
                    className="w-full p-2 border border-app-border rounded-md text-sm"
                  />
                </div>
                {
                  soporteIndex > 0 && (
                    <div className="col-span-1 flex items-center justify-cente m-7">
                      <span
                        className={`inline-block transform transition-transform duration-200  cursor-pointer hover:text-red-600`}
                        onClick={() => { handle_remove_soporte(soporteIndex); }}
                      >
                        &#10005;
                      </span>
                    </div>
                  )}
              </div>
            ))}

          {renderCronogramaField()}
        </div>
      </div>)}
    </div>
  );
};

export default ActivityItem;

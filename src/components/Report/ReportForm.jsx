import React, { useState, useEffect } from "react";
import styles from "./ReportForm.module.css";
import Header from "../Header/Header";
import Event from "../Event/Event";
import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";

import Swal from "sweetalert2";

// URL PARA PETICION BACK
// const url = `http://localhost:1337/api/labels`;
const back = import.meta.env.VITE_APP_BACK;
const url = `${back}/api/labels`;

const ReportForm = () => {
  //const token = useSelector((state) => state.token.token);
  const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  const token = token_object.token;
  // console.log("token", token_object.token);

  const [ejes, setEjes] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [entornos, setEntornos] = useState([]);
  const [tecnologias, setTecnologias] = useState([]);
  const [poblaciones, setPoblacion] = useState([]);
  const [soportes, setSoportes] = useState([]);
  const [cups, setCups] = useState([]);

  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState([]);

  const [events, setEvents] = useState([
    {
      subregion: [],
      operador_pic: "",
      // municipio_priorizado: "",
      codigo_nombre_territorio: "",
      codigo_micro_territorio: "",
      total_hogares: "",
      equipo_operativo: "",
      perfil_profesional: "",
      perfil_operativo: "",
      proyecto: "",
      description_event: "",
      indicator_name: "",
      meta_indicator: "",
      eje_estrategico: [],
      linea_operativa: "",
      activities: [],
      product_data: {
        producto: [
          {
            descripcion_producto: "",
            indicadores: [
              {
                cantidad: "",
                indicador_linea_base: "",
                meta_producto: "",
              },
            ],
            // nombre_entidad: "",
            // descripcion_operador: "",
          },
        ],
      },
    },
  ]);

  const resetForm = () => {
    // Reiniciar los datos del evento
    setEvents([
      {
        subregion: [],
        operador_pic: "",
        // municipio_priorizado: "",
        codigo_nombre_territorio: "",
        codigo_micro_territorio: "",
        total_hogares: "",
        equipo_operativo: "",
        perfil_profesional: "",
        perfil_operativo: "",
        proyecto: "",
        description_event: "",
        indicator_name: "",
        meta_indicator: "",
        eje_estrategico: [],
        linea_operativa: "",
        activities: [],
        product_data: {
          producto: [
            {
              descripcion_producto: "",
              indicadores: [
                {
                  cantidad: "",
                  indicador_linea_base: "",
                  meta_producto: "",
                },
              ],
              // nombre_entidad: "",
              // descripcion_operador: "",
            },
          ],
        },
      },
    ]);

    // Reiniciar el estado de éxito
  };

  useEffect(() => {
    const fetchSubregions = async () => {
      try {
        const response = await fetch(`${url}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener subregiones.");
        const data = await response.json();
        //setSubregions(data.data);
        setLabels(data);
        setEjes(data.ejes);
        setLineas(data.lineas_operativas);
        setEntornos(data.entornos);
        setTecnologias(data.tecnologias);
        setPoblacion(data.poblacion_sujeto);
        setSoportes(data.soportes);
        setCups(data.cups);
      } catch (error) {
        console.error("Error fetching subregions:", error);
      }
    };

    fetchSubregions();
  }, [token]);

  console.log("Datos eventos", events);

  // const validateEvents = () => {
  //   for (let i = 0; i < events.length; i++) {
  //     const event = events[i];

  //     if (!event.operador_pic) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Campo requerido",
  //         text: `Por favor selecciona el operador PIC en el evento ${i + 1}`,
  //       });
  //       return false;
  //     }

  //     if (!event.equipo_operativo) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Campo requerido",
  //         text: `Por favor selecciona el equipo operativo en el evento ${
  //           i + 1
  //         }`,
  //       });
  //       return false;
  //     }

  //     // Puedes agregar aquí más validaciones que necesites...
  //   }

  //   return true; // Todo está correcto
  // };

  // const requiredFields = [
  //   { field: "operador_pic", name: "Operador PIC" },
  //   { field: "equipo_operativo", name: "Equipo Operativo" },
  //   { field: "perfil_profesional", name: "Perfil Profesional" },
  //   { field: "perfil_operativo", name: "Perfil Operativo" },
  //   { field: "codigo_nombre_territorio", name: "Nombre Territorio" },
  //   // Agrega aquí los campos que quieras validar
  // ];

  const requiredFields = [
    { path: "operador_pic", name: "Operador PIC" },
    { path: "equipo_operativo", name: "Equipo Operativo" },
    { path: "perfil_profesional", name: "Perfil Profesional" },
    { path: "perfil_operativo", name: "Perfil Operativo" },
    { path: "codigo_nombre_territorio", name: "Nombre Territorio" },

    // Validaciones sobre arrays
    {
      path: "product_data",
      array: true,
      fields: [
        {
          path: "producto.descripcion_producto",
          name: "Descripción Producto",
        },
      ],
    },

    {
      path: "actividades",
      array: true,
      fields: [
        { path: "descripcion_actividad", name: "Descripción Actividad" },
      ],
    },
  ];

  // const validateEvents = () => {
  //   for (let i = 0; i < events.length; i++) {
  //     const event = events[i];

  //     for (let fieldInfo of requiredFields) {
  //       const { field, name } = fieldInfo;
  //       if (
  //         !event[field] ||
  //         (typeof event[field] === "string" && event[field].trim() === "")
  //       ) {
  //         Swal.fire({
  //           icon: "warning",
  //           title: "Campo requerido",
  //           text: `Por favor llena el campo "${name}" en el evento ${i + 1}.`,
  //         });
  //         return false;
  //       }
  //     }

  //     // También puedes hacer validaciones especiales aquí:
  //     // if (Array.isArray(event.subregion) && event.subregion.length === 0) {
  //     //   Swal.fire({
  //     //     icon: "warning",
  //     //     title: "Campo requerido",
  //     //     text: `Debes seleccionar al menos una Subregión en el evento ${i + 1}.`,
  //     //   });
  //     //   return false;
  //     // }
  //   }

  //   return true; // Todo está bien
  // };

  // const getValueByPath = (obj, path) => {
  //   return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  // };

  // const validateEvents = () => {
  //   for (let i = 0; i < events.length; i++) {
  //     const event = events[i];

  //     // Primero validamos campos normales
  //     const fields = [
  //       { path: "operador_pic", name: "Operador PIC" },
  //       { path: "equipo_operativo", name: "Equipo Operativo" },
  //       { path: "perfil_profesional", name: "Perfil Profesional" },
  //       { path: "perfil_operativo", name: "Perfil Operativo" },
  //       { path: "codigo_nombre_territorio", name: "Nombre Territorio" },
  //     ];

  //     for (let field of fields) {
  //       const value = getValueByPath(event, field.path);
  //       if (!value || (typeof value === "string" && value.trim() === "")) {
  //         Swal.fire({
  //           icon: "warning",
  //           title: "Campo requerido",
  //           text: `Falta "${field.name}" en el evento ${i + 1}.`,
  //         });
  //         return false;
  //       }
  //     }

  //     // Ahora validamos productos
  //     if (
  //       !event.product_data ||
  //       !event.product_data.producto ||
  //       !Array.isArray(event.product_data.producto) ||
  //       event.product_data.producto.length === 0
  //     ) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Campo requerido",
  //         text: `El evento ${i + 1} debe tener al menos un Producto.`,
  //       });
  //       return false;
  //     }

  //     for (let j = 0; j < event.product_data.producto.length; j++) {
  //       const producto = event.product_data.producto[j];
  //       if (
  //         !producto.descripcion_producto ||
  //         producto.descripcion_producto.trim() === ""
  //       ) {
  //         Swal.fire({
  //           icon: "warning",
  //           title: "Campo requerido",
  //           text: `Falta "Descripción Producto" en el Producto ${
  //             j + 1
  //           } del evento ${i + 1}.`,
  //         });
  //         return false;
  //       }
  //     }

  //     // Ahora validamos actividades
  //     if (!Array.isArray(event.actividades) || event.actividades.length === 0) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Campo requerido",
  //         text: `El evento ${i + 1} debe tener al menos una Actividad.`,
  //       });
  //       return false;
  //     }

  //     for (let k = 0; k < event.actividades.length; k++) {
  //       const actividad = event.actividades[k];
  //       if (
  //         !actividad.descripcion_actividad ||
  //         actividad.descripcion_actividad.trim() === ""
  //       ) {
  //         Swal.fire({
  //           icon: "warning",
  //           title: "Campo requerido",
  //           text: `Falta "Descripción Actividad" en la Actividad ${
  //             k + 1
  //           } del evento ${i + 1}.`,
  //         });
  //         return false;
  //       }
  //     }

  //     // Validación especial de subregión
  //     if (Array.isArray(event.subregion) && event.subregion.length === 0) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Campo requerido",
  //         text: `Debes seleccionar al menos una Subregión en el evento ${
  //           i + 1
  //         }.`,
  //       });
  //       return false;
  //     }
  //   }

  //   return true;
  // };

  // // Utilidad para leer paths normales
  // const getValueByPath = (obj, path) => {
  //   return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  // };

  const getValueByPath = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  // const validateEventsData = (events) => {
  //   for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
  //     const event = events[eventIndex];

  //     // Validaciones de campos simples
  //     const fields = [
  //       { path: "operador_pic", name: "Operador PIC" },
  //       { path: "equipo_operativo", name: "Equipo Operativo" },
  //       { path: "perfil_profesional", name: "Perfil Profesional" },
  //       { path: "perfil_operativo", name: "Perfil Operativo" },
  //       { path: "codigo_nombre_territorio", name: "Nombre Territorio" },
  //     ];

  //     for (let field of fields) {
  //       const value = getValueByPath(event, field.path);
  //       if (!value || (typeof value === "string" && value.trim() === "")) {
  //         Swal.fire({
  //           icon: "warning",
  //           title: "Campo requerido",
  //           text: `Falta "${field.name}" en el evento ${eventIndex + 1}.`,
  //         });
  //         return false;
  //       }
  //     }

  //     // Validar productos
  //     if (!event.product_data || !Array.isArray(event.product_data.producto)) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Datos incompletos",
  //         text: `No se encontraron productos en el evento ${eventIndex + 1}.`,
  //       });
  //       return false;
  //     }

  //     for (
  //       let productIndex = 0;
  //       productIndex < event.product_data.producto.length;
  //       productIndex++
  //     ) {
  //       const producto = event.product_data.producto[productIndex];

  //       if (
  //         !producto.descripcion_producto ||
  //         producto.descripcion_producto.trim() === ""
  //       ) {
  //         Swal.fire({
  //           icon: "warning",
  //           title: "Producto incompleto",
  //           text: `El producto ${productIndex + 1} en el evento ${
  //             eventIndex + 1
  //           } no tiene descripción.`,
  //         });
  //         return false;
  //       }
  //       if (!producto.indicadores || producto.indicadores.trim() === "") {
  //         Swal.fire({
  //           icon: "warning",
  //           title: "Producto incompleto",
  //           text: `El producto ${productIndex + 1} en el evento ${
  //             eventIndex + 1
  //           } no tiene indicador`,
  //         });
  //         return false;
  //       }
  //       if (!producto.valor_producto) {
  //         Swal.fire({
  //           icon: "warning",
  //           title: "Producto incompleto",
  //           text: `El producto ${productIndex + 1} en el evento ${
  //             eventIndex + 1
  //           } no tiene valor.`,
  //         });
  //         return false;
  //       }

  //       // Validar actividades
  //       const actividades = event.activities?.[productIndex];
  //       if (!actividades || actividades.length === 0) {
  //         Swal.fire({
  //           icon: "warning",
  //           title: "Actividad incompleta",
  //           text: `El producto ${productIndex + 1} en el evento ${
  //             eventIndex + 1
  //           } no tiene actividades asociadas.`,
  //         });
  //         return false;
  //       }

  //       for (
  //         let activityIndex = 0;
  //         activityIndex < actividades.length;
  //         activityIndex++
  //       ) {
  //         const actividad = actividades[activityIndex];

  //         if (
  //           !actividad.descripcion_actividad ||
  //           actividad.descripcion_actividad.trim() === ""
  //         ) {
  //           Swal.fire({
  //             icon: "warning",
  //             title: "Actividad incompleta",
  //             text: `La actividad ${activityIndex + 1} del producto ${
  //               productIndex + 1
  //             } en el evento ${eventIndex + 1} no tiene descripción.`,
  //           });
  //           return false;
  //         }
  //         if (!actividad.cantidad) {
  //           Swal.fire({
  //             icon: "warning",
  //             title: "Actividad incompleta",
  //             text: `La actividad ${activityIndex + 1} del producto ${
  //               productIndex + 1
  //             } en el evento ${eventIndex + 1} no tiene cantidad.`,
  //           });
  //           return false;
  //         }
  //         if (
  //           !actividad.unidad_medida ||
  //           actividad.unidad_medida.trim() === ""
  //         ) {
  //           Swal.fire({
  //             icon: "warning",
  //             title: "Actividad incompleta",
  //             text: `La actividad ${activityIndex + 1} del producto ${
  //               productIndex + 1
  //             } en el evento ${eventIndex + 1} no tiene unidad de medida.`,
  //           });
  //           return false;
  //         }
  //         if (!actividad.valor_unitario) {
  //           Swal.fire({
  //             icon: "warning",
  //             title: "Actividad incompleta",
  //             text: `La actividad ${activityIndex + 1} del producto ${
  //               productIndex + 1
  //             } en el evento ${eventIndex + 1} no tiene valor unitario.`,
  //           });
  //           return false;
  //         }
  //         if (!actividad.valor_total) {
  //           Swal.fire({
  //             icon: "warning",
  //             title: "Actividad incompleta",
  //             text: `La actividad ${activityIndex + 1} del producto ${
  //               productIndex + 1
  //             } en el evento ${eventIndex + 1} no tiene valor total.`,
  //           });
  //           return false;
  //         }

  //         // Validar entornos
  //         if (
  //           !actividad.entorno ||
  //           !Array.isArray(actividad.entorno) ||
  //           actividad.entorno.length === 0
  //         ) {
  //           Swal.fire({
  //             icon: "warning",
  //             title: "Entornos incompletos",
  //             text: `La actividad ${activityIndex + 1} del producto ${
  //               productIndex + 1
  //             } en el evento ${eventIndex + 1} no tiene entornos asociados.`,
  //           });
  //           return false;
  //         }

  //         for (
  //           let entornoIndex = 0;
  //           entornoIndex < actividad.entorno.length;
  //           entornoIndex++
  //         ) {
  //           const entorno = actividad.entorno[entornoIndex];
  //           if (!entorno || entorno.trim() === "") {
  //             Swal.fire({
  //               icon: "warning",
  //               title: "Entorno vacío",
  //               text: `El entorno ${entornoIndex + 1} de la actividad ${
  //                 activityIndex + 1
  //               } del producto ${productIndex + 1} en el evento ${
  //                 eventIndex + 1
  //               } está vacío.`,
  //             });
  //             return false;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   // Si todo está correcto
  //   return true;
  // };

  const validateEventsData = (events) => {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      // event.subregion.length > 0

      if (!event.subregion.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Campo incompleto",
          text: `Sub-Región" está vacío en el evento ${i + 1}.`,
        });
        return false;
      }

      if (!event.operador_pic) {
        Swal.fire({
          icon: "warning",
          title: "Campo incompleto",
          text: `El campo "Operador PIC" está vacío en el evento ${i + 1}.`,
        });
        return false;
      }

      if (!event.equipo_operativo) {
        Swal.fire({
          icon: "warning",
          title: "Campo incompleto",
          text: `El campo "Equipo Operativo" está vacío en el evento ${i + 1}.`,
        });
        return false;
      }

      if (!event.perfil_profesional) {
        Swal.fire({
          icon: "warning",
          title: "Campo incompleto",
          text: `El campo "Perfil Profesional" está vacío en el evento ${
            i + 1
          }.`,
        });
        return false;
      }

      if (!event.perfil_operativo) {
        Swal.fire({
          icon: "warning",
          title: "Campo incompleto",
          text: `El campo "Perfil Operativo" está vacío en el evento ${i + 1}.`,
        });
        return false;
      }

      if (!event.product_data?.producto?.length) {
        Swal.fire({
          icon: "warning",
          title: "Campo incompleto",
          text: `Debe agregar al menos un producto en el evento ${i + 1}.`,
        });
        return false;
      }

      for (let j = 0; j < event.product_data.producto.length; j++) {
        const producto = event.product_data.producto[j];

        if (!producto.descripcion_producto) {
          Swal.fire({
            icon: "warning",
            title: "Campo incompleto",
            text: `Falta la descripción del producto ${j + 1} en el evento ${
              i + 1
            }.`,
          });
          return false;
        }

        if (!producto.descripcion_producto) {
          Swal.fire({
            icon: "warning",
            title: "Campo incompleto",
            text: `Falta la descripción del producto ${j + 1} en el evento ${
              i + 1
            }.`,
          });
          return false;
        }

        const indicadores = producto.indicadores || [];

        if (!indicadores.length) {
          Swal.fire({
            icon: "warning",
            title: "Indicadores requeridos",
            text: `Debe agregar al menos un indicador para el producto ${
              j + 1
            } en el evento ${i + 1}.`,
          });
          return false;
        }

        for (let l = 0; l < indicadores.length; l++) {
          const indicador = indicadores[l];

          if (!indicador.meta_producto) {
            Swal.fire({
              icon: "warning",
              title: "Meta del producto requerida",
              text: `Falta la meta del producto en el indicador ${
                l + 1
              } del producto ${j + 1} en el evento ${i + 1}.`,
            });
            return false;
          }

          if (!indicador.cantidad || indicador.cantidad <= 0) {
            Swal.fire({
              icon: "warning",
              title: "Cantidad inválida",
              text: `La cantidad en el indicador ${l + 1} del producto ${
                j + 1
              } en el evento ${i + 1} es inválida.`,
            });
            return false;
          }

          if (!indicador.indicador_linea_base) {
            Swal.fire({
              icon: "warning",
              title: "Indicador línea base requerido",
              text: `Falta el valor de línea base en el indicador ${
                l + 1
              } del producto ${j + 1} en el evento ${i + 1}.`,
            });
            return false;
          }
        }
        //**************** */

        const actividades = event.activities?.[j] || [];

        if (!actividades.length) {
          Swal.fire({
            icon: "warning",
            title: "Campo incompleto",
            text: `Debe agregar al menos una actividad para el producto ${
              j + 1
            } en el evento ${i + 1}.`,
          });
          return false;
        }

        for (let k = 0; k < actividades.length; k++) {
          const actividad = actividades[k];

          if (!actividad.descripcion_actividad) {
            Swal.fire({
              icon: "warning",
              title: "Campo incompleto",
              text: `Falta la descripción de la actividad ${
                k + 1
              } del producto ${j + 1} en el evento ${i + 1}.`,
            });
            return false;
          }

          if (!actividad.cantidad || actividad.cantidad <= 0) {
            Swal.fire({
              icon: "warning",
              title: "Cantidad inválida",
              text: `La cantidad de la actividad ${k + 1} del producto ${
                j + 1
              } en el evento ${i + 1} es inválida.`,
            });
            return false;
          }

          if (!actividad.unidad_medida) {
            Swal.fire({
              icon: "warning",
              title: "Unidad de medida requerida",
              text: `Falta la unidad de medida de la actividad ${
                k + 1
              } del producto ${j + 1} en el evento ${i + 1}.`,
            });
            return false;
          }

          if (!actividad.valor_unitario || actividad.valor_unitario <= 0) {
            Swal.fire({
              icon: "warning",
              title: "Valor unitario inválido",
              text: `El valor unitario de la actividad ${k + 1} del producto ${
                j + 1
              } en el evento ${i + 1} es inválido.`,
            });
            return false;
          }

          if (!actividad.valor_total || actividad.valor_total <= 0) {
            Swal.fire({
              icon: "warning",
              title: "Valor total inválido",
              text: `El valor total de la actividad ${k + 1} del producto ${
                j + 1
              } en el evento ${i + 1} es inválido.`,
            });
            return false;
          }

          if (!actividad.entorno?.length) {
            Swal.fire({
              icon: "warning",
              title: "Campo entorno requerido",
              text: `Debe agregar al menos un entorno para la actividad ${
                k + 1
              } del producto ${j + 1} en el evento ${i + 1}.`,
            });
            return false;
          }

          if (!actividad.tecnologia?.length) {
            Swal.fire({
              icon: "warning",
              title: "Campo tecnología requerido",
              text: `Debe agregar al menos una tecnología para la actividad ${
                k + 1
              } del producto ${j + 1} en el evento ${i + 1}.`,
            });
            return false;
          }

          if (!actividad.poblacion_sujeto?.length) {
            Swal.fire({
              icon: "warning",
              title: "Campo población sujeto requerido",
              text: `Debe agregar al menos una población objetivo para la actividad ${
                k + 1
              } del producto ${j + 1} en el evento ${i + 1}.`,
            });
            return false;
          }

          if (!actividad.codigo_cups) {
            Swal.fire({
              icon: "warning",
              title: "Código CUPS requerido",
              text: `Debe ingresar el código CUPS para la actividad ${
                k + 1
              } del producto ${j + 1} en el evento ${i + 1}.`,
            });
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // if (!validateEvents()) {
    //   return; // Si la validación falla, NO enviamos nada
    // }

    const isValid = validateEventsData(events);
    if (!isValid) {
      // No seguir con el envío
      return;
    }

    try {
      setLoading(true);
      // Transformar los datos al formato requerido
      const transformedData = {
        data: {
          eventos: events.map((event) => ({
            // operador_pic: {
            //   connect: [{ documentId: event.operador_pic }] || null,
            // },
            operador_pic: event.operador_pic
              ? {
                  connect: [{ documentId: event.operador_pic }],
                }
              : null,
            equipo: event.equipo_operativo || null,
            perfiles_profesional: event.perfil_profesional || null,
            perfil_operativo: event.perfil_operativo || null,

            territorializacion:
              event.total_hogares ||
              (Array.isArray(event.subregion) && event.subregion.length > 0) ||
              event.codigo_nombre_territorio ||
              event.codigo_micro_territorio
                ? {
                    // numero_hogares: parseInt(event.total_hogares, 10) || null,
                    numero_hogares: event.total_hogares || null,
                    municipios:
                      Array.isArray(event.subregion) &&
                      event.subregion.length > 0
                        ? {
                            connect: (event.subregion || []).map((region) => ({
                              documentId: region || null,
                            })),
                          }
                        : [],
                    territorio: event.codigo_nombre_territorio || null,
                    microterritorio: event.codigo_micro_territorio || null,
                  }
                : null,

            descripcion: event.description_event || null,
            indicador_evento: event.indicator_name || null,
            meta_indicador_evento: event.meta_indicator || null,

            ejes_estrategicos: (event.eje_estrategico || []).map((eje) => ({
              nombre: eje || null,
            })),

            lineas_operativa: { nombre: event.linea_operativa || null },

            productos: event.product_data.producto.map((producto, index) => ({
              descripcion: producto.descripcion_producto || null,

              actividades: (event.activities[index] || []).map((activity) => ({
                descripcion: activity.descripcion_actividad || null,
                cantidad_a_ejecutar: activity.cantidad || null,
                unidad_medida: activity.unidad_medida || null,
                valor_unitario: activity.valor_unitario || null,
                valor_total: activity.valor_total || null,
                entornos: activity.entorno.map((entorno) => ({
                  nombre: entorno || null,
                })),

                tecnologias: activity.tecnologia.map((tecno) => ({
                  nombre: tecno || null,
                })),

                poblaciones: activity.poblacion_sujeto.map((poblacion) => ({
                  nombre: poblacion || null,
                })),
                cups: { codigo: activity.codigo_cups } || null,
                soportes: activity.array_soportes.map((soporte) => ({
                  tipo: soporte.tipo_soporte || null,
                  descripcion: soporte.descripcion_soporte || null,
                  cantidad: soporte.cantidad_soporte || null,
                })),
                cronograma: activity.cronograma.map((item) => ({
                  [item.mes]: parseInt(item.peso, 10),
                })),
              })),

              indicadores: (producto.indicadores || []).map((indicador) => ({
                meta_producto: indicador.meta_producto || null,
                cantidad: indicador.cantidad || null,
                indicador_linea_base: indicador.indicador_linea_base || null,
              })),
            })),
            proyectos_idsn: event.proyecto
              ? {
                  connect: [{ documentId: event.proyecto }] || null,
                }
              : null,
          })),
        },
      };

      console.log("Transformed Data:", transformedData);

      // Realizar la solicitud
      // const response = await fetch("http://localhost:1337/api/anexo-tecnicos", {
      const response = await fetch(`${back}/api/anexo-tecnicos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) throw new Error("Error al enviar el reporte.");

      // Reiniciar el formulario
      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "¡Envío correcto!",
        text: "Informacion agregada correctamente!",
      });

      resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al enviar la información!",
      });
      setLoading(false);
      console.error(error);
    }
  };

  if (loading) return <Spinner envio={"Enviando datos, por favor espera..."} />;

  return (
    <>
      <Header />

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.field}>
            <Event
              events={events}
              setEvents={setEvents}
              ejes={ejes}
              lineas={lineas}
              entornos={entornos}
              tecnologias={tecnologias}
              poblaciones={poblaciones}
              soportes={soportes}
              cups={cups}
            />
          </div>

          <div className={styles.contedor_boton}>
            <button
              className={styles.buttonMain}
              type="submit"
              // disabled={loading}
            >
              Enviar Anexo
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ReportForm;

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

  const handleSubmit = async (event) => {
    event.preventDefault();

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
            // territorializacion:
            //   {
            //     numero_hogares: parseInt(event.total_hogares, 10) || null,
            //     municipios: {
            //       connect: (event.subregion || []).map((region) => ({
            //         documentId: region || null,
            //       })),
            //     },
            //     territorio: event.codigo_nombre_territorio || null,
            //     microterritorio: event.codigo_micro_territorio || null,
            //   } || null,
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
            // lineas_operativa: (event.linea_operativa || []).map((linea) => ({
            //   nombre: linea || null,
            // })),
            lineas_operativa: { nombre: event.linea_operativa || null },

            // lineas_operativa: event.linea_operativa
            //   ? [
            //       {
            //         nombre: event.linea_operativa,
            //       },
            //     ]
            //   : [],

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

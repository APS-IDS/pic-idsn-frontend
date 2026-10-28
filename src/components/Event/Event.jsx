import React, { useState, useEffect, useMemo, useRef } from "react";
import Product from "../Product/Product";
import Select from "react-select"; // Importamos React Select
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import {
  INITIAL_EVENT_STATE,
  ANIOS_DISPONIBLES,
  PARAMETROS_INICIALES,
  NEW_ANEXO_DATE,
  OLD_ANEXO_DATE,
  transformEvent,
} from "../../utils/const_forms";
import validateEventsData from "../../utils/validate_events";
import { fetchAnexo } from "../../utils/api";
import { mergeEvents, mergeValue, tagEvents } from "../../utils/merge_events";
import { eventMatchesSearch } from "../../utils/filter_events";
import Spinner from "../Spinner/Spinner";

const Event = ({ eventsEdit, anexo, onSaved }) => {
  const [parametros, setParametros] = useState(PARAMETROS_INICIALES);
  const [municipios, setMunicipios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [events, setEvents] = useState(
    eventsEdit && eventsEdit.length > 0 ? eventsEdit : [INITIAL_EVENT_STATE],
  );
  const [loading, setLoading] = useState(false);
  const [anexoYear, setAnexoYear] = useState(NEW_ANEXO_DATE);
  const [expandedEvents, setExpandedEvents] = useState([true]);
  const [search, setSearch] = useState("");
  // Versión del anexo que se abrió: se envía al guardar y es la base para
  // combinar si otra persona guardó antes.
  const baseRef = useRef({ events: [], anio: "", version: 0 });
  const anexoOptions = ANIOS_DISPONIBLES.map((option) => ({
    value: option,
    label: option,
  }));

  const styleSelect = { menuPortal: (base) => ({ ...base, zIndex: 9999 }) };

  const resetForm = () => {
    if (eventsEdit && eventsEdit.length > 0) {
      setEvents(eventsEdit);
    } else {
      setEvents([INITIAL_EVENT_STATE]);
      setAnexoYear(NEW_ANEXO_DATE);
    }
  };

  const token =
    useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;

  const back = import.meta.env.VITE_APP_BACK;
  const url_parametros = `${back}/api/labels`;
  const url_municipios = `${back}/api/municipios?pagination[pageSize]=100`;
  const url_proyectos = `${back}/api/proyectos-idsns`;
  const url_operadores = `${back}/api/operador-pics?pagination[pageSize]=200`;

  const mapperOptions = (data, valueField, labelField) => {
    if (!data) return [];

    if (valueField === undefined || labelField === undefined) {
      return data.map((item) => ({
        value: item,
        label: item,
      }));
    }

    return data.map((item) => ({
      value: item[valueField],
      label: item[labelField],
    }));
  };

  const fetchParametros = async () => {
    try {
      const response = await fetch(`${url_parametros}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener subregiones.");
      const data = await response.json();

      setParametros({
        labels: data,
        cursos: mapperOptions(data.curso_de_vida),
        cups: mapperOptions(data.cups),
        ejes: mapperOptions(data.ejes),
        entornos: mapperOptions(data.entornos),
        equipos: mapperOptions(data.equipos),
        lineas: mapperOptions(data.lineas_operativas),
        poblaciones: mapperOptions(data.poblacion_sujeto),
        soportes: mapperOptions(data.soportes),
        tecnologias: mapperOptions(data.tecnologias),
      });
    } catch (error) {
      console.error("Error fetching subregions:", error);
    }
  };

  const fetchSubregion = async () => {
    try {
      const response = await fetch(`${url_municipios}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener subregiones.");
      const data = await response.json();
      setMunicipios(mapperOptions(data.data, "documentId", "label"));
    } catch (error) {
      console.error("Error fetching subregions:", error);
    }
  };

  const fetchProyecto = async () => {
    try {
      const response = await fetch(`${url_proyectos}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener subregiones.");
      const data = await response.json();
      const proyectos = mapperOptions(data.data, "documentId", "proyecto");
      setProyectos(proyectos);
    } catch (error) {
      console.error("Error fetching subregions:", error);
    }
  };

  const fetchOperador = async () => {
    try {
      const response = await fetch(`${url_operadores}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener subregiones.");
      const data = await response.json();
      setOperadores(mapperOptions(data.data, "documentId", "operador_pic"));
    } catch (error) {
      console.error("Error fetching subregions:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchParametros(),
          fetchProyecto(),
          fetchOperador(),
          fetchSubregion(),
        ]);
      } catch (error) {
        console.error("Error fetching parameters:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  useEffect(() => {
    if (eventsEdit && eventsEdit.length > 0) {
      const version = anexo?.version ?? 0;
      const tagged = tagEvents(eventsEdit, version);
      // Copia profunda: los handlers modifican los eventos en sitio.
      baseRef.current = {
        events: structuredClone(tagged),
        anio: anexo?.anio ?? "",
        version,
      };
      setEvents(tagged);
      setExpandedEvents(tagged.map(() => false));
    }
  }, [eventsEdit, anexo]);

  useEffect(() => {
    if (anexo && anexo.anio) {
      setAnexoYear(anexo.anio);
    }
  }, [anexo]);

  const handleToggle = (index) => {
    setExpandedEvents((prevExpandedEvents) => {
      const newExpandedEvents = [...prevExpandedEvents];
      newExpandedEvents[index] = !newExpandedEvents[index];
      return newExpandedEvents;
    });
  };

  const handleStrategicAxisChange = (eventIndex, selectedOptions) => {
    const updatedEvents = [...events];
    updatedEvents[eventIndex].eje_estrategico = selectedOptions.map(
      (option) => option.value,
    );
    setEvents(updatedEvents);
  };

  const handle_municipio = (eventIndex, selectedOptions) => {
    console.log(
      "Selected municipios for event index",
      eventIndex,
      ":",
      selectedOptions,
    );
    const updatedEvents = [...events];
    updatedEvents[eventIndex].subregion = selectedOptions.map(
      (option) => option.value,
    );
    setEvents(updatedEvents);
  };

  const handleEventChange = (index, campo, valor) => {
    const nuevosEventos = [...events];
    nuevosEventos[index] = {
      ...nuevosEventos[index],
      [campo]: valor,
    };
    setEvents(nuevosEventos);
  };

  const handleAddEvent = () => {
    const nuevoEvento = { ...INITIAL_EVENT_STATE };
    setEvents([...events, nuevoEvento]);
    setExpandedEvents([...expandedEvents, false]);
    // El evento nuevo está vacío: con un filtro activo quedaría oculto.
    setSearch("");
  };

  const handle_proyecto = (eventIndex, selectedOption) => {
    const updatedEvents = [...events];
    updatedEvents[eventIndex].proyecto = selectedOption
      ? selectedOption.value
      : "";
    setEvents(updatedEvents);
  };

  const handle_operador = (eventIndex, selectedOption) => {
    const updatedEvents = [...events];
    updatedEvents[eventIndex].operador_pic = selectedOption
      ? selectedOption.value
      : ""; // Guarda el valor seleccionado o una cadena vacía si no hay selección
    // Depuración: Verifica el estado actualizado
    setEvents(updatedEvents);
  };

  const handleRemoveEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    const updatedExpandedEvents = [...expandedEvents];
    setEvents(updatedEvents);
    setExpandedEvents(updatedExpandedEvents);
  };

  const handle_remove_event = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el evento",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveEvent(index);
        Swal.fire("Eliminado", "El evento ha sido eliminado.", "success");
      }
    });
  };

  // Otra persona guardó el anexo después de abrirlo (409): se carga la versión
  // más reciente y se le aplican encima los eventos cambiados sin guardar.
  const resolveConflict = async () => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "El anexo cambió mientras lo editabas",
      html:
        "Otra persona guardó cambios en este anexo después de que lo abriste. " +
        "<b>Tus cambios todavía no se han guardado.</b><br/><br/>" +
        "Puedes cargar la versión más reciente sin perder lo que diligenciaste: " +
        "los eventos que modificaste se conservan como los dejaste y los que " +
        "agregaste quedan al final. Después revisa el anexo y vuelve a guardar.",
      showCancelButton: true,
      confirmButtonText: "Cargar últimos cambios y conservar los míos",
      cancelButtonText: "Seguir editando",
      allowOutsideClick: false,
    });

    if (!isConfirmed) return;

    const latest = await fetchAnexo(anexo.documentId, token);
    const version = latest.version ?? 0;
    const latestAnio = latest.anexo_tecnico_date ?? "";
    const theirs = tagEvents(latest.eventos.map(transformEvent), version);
    const base = baseRef.current;
    const merged = mergeEvents(base.events, events, theirs);

    baseRef.current = {
      events: structuredClone(theirs),
      anio: latestAnio,
      version,
    };
    setEvents(merged);
    setExpandedEvents(merged.map(() => true));
    setAnexoYear(mergeValue(base.anio, anexoYear, latestAnio) || "");

    await Swal.fire({
      icon: "info",
      title: "Versión actualizada",
      text: "Se cargaron los últimos cambios junto con los tuyos. Revisa el anexo y vuelve a guardar.",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateEventsData(events, anexoYear);

    if (!isValid) {
      return;
    }

    const isEdit = Boolean(eventsEdit?.length && anexo?.documentId);

    try {
      setLoading(true);

      const transformedData = {
        data: {
          anexo_tecnico_date: anexoYear || null,
          ...(isEdit && { version: baseRef.current.version }),

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
                    numero_pobalcion_intervenir: event.poblacion || null,
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
              problematica_priorizada: producto.problematica || null,
              actividades: (event.activities[index] || []).map((activity) => ({
                descripcion: activity.descripcion_actividad || null,
                cantidad_a_ejecutar: activity.cantidad || null,
                unidad_medida: activity.unidad_medida || null,
                valor_unitario: activity.valor_unitario || null,
                costos_directos: activity.costo_directo || null,
                costos_indirectos: activity.costo_indirecto || null,
                valor_total: activity.valor_total || null,
                entornos: activity.entorno.map((entorno) => ({
                  nombre: entorno || null,
                })),

                tecnologias: activity.tecnologia.map((tecno) => ({
                  nombre: tecno || null,
                })),
                curso_de_vida: activity.cursos_vida.map((curso) => ({
                  nombre: curso || null,
                })),

                // curso_de_vida: activity.cursos_vida[0] || null,

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

      const url = isEdit
        ? `${back}/api/anexo-tecnicos/${anexo.documentId}`
        : `${back}/api/anexo-tecnicos`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformedData),
      });

      if (isEdit && response.status === 409) {
        await resolveConflict();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        const serverMessage =
          data?.error?.message ||
          data?.message ||
          "Error desconocido del servidor";

        throw new Error(`(${response.status}) ${serverMessage}`);
      }

      await Swal.fire({
        icon: "success",
        title: isEdit ? "¡Actualización correcta!" : "¡Registro correcto!",
        text: isEdit
          ? "La información fue actualizada correctamente."
          : "La información fue agregada correctamente.",
      });

      if (isEdit) {
        await onSaved?.();
      } else {
        resetForm();
      }
    } catch (error) {
      console.error("ERROR BACKEND:", error);
      Swal.fire({
        icon: "error",
        title: "Error al enviar",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const municipiosOrdenados = useMemo(
    () =>
      [...municipios]
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((muni) => ({ value: muni.value, label: muni.label })),
    [municipios],
  );

  const matchesSearch = (event) =>
    eventMatchesSearch(event, search, { proyectos, operadores });
  const visibleEventsCount = events.filter(matchesSearch).length;

  if (loading) return <Spinner envio={"Enviando datos, por favor espera..."} />;
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-app-card border border-app-border rounded-xl mb-4 overflow-hidden shadow-sm">
        <div className="bg-teal text-app-card py-3 px-4 flex justify-between items-center font-semibold">
          Información General del Anexo
        </div>
        <div className="grid sm:grid-cols-3 gap-4 items-start">
          <div className="m-6">
            <label className="block text-xs text-app-muted mb-1">
              AÑO ANEXO
            </label>
            <select
              name="año"
              value={anexoYear.split("-")[0] || ""}
              className="w-full p-2 pr-10 border border-app-border rounded-md text-sm cursor-pointer hover:bg-gray-200"
              onChange={(e) =>
                setAnexoYear(e.target.value ? `${e.target.value}-01-01` : "")
              }
            >
              <option value="">Seleccionar Año</option>
              {anexoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="my-3">
        <div className="flex justify-between items-center gap-4 mb-2">
          <span className="font-semibold text-navy uppercase">Eventos</span>
          <div className="flex flex-1 justify-end items-center gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // Enter dentro del formulario lo enviaría y guardaría el anexo.
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              placeholder="Buscar por descripción, indicador, proyecto u operador"
              aria-label="Buscar eventos"
              className="w-full max-w-md p-2 border border-app-border rounded-md text-sm"
            />
            <button
              type="button"
              className="flex shrink-0 items-center gap-2 whitespace-nowrap bg-green-brand text-white border-0 py-2 pl-4 pr-3 rounded-3xl border-bg-teal-900 text-sm cursor-pointer hover:bg-teal"
              onClick={handleAddEvent}
            >
              <span className="">+</span> Agregar evento
            </button>
          </div>
        </div>
      </div>

      {!events.length && (
        <p className="text-center text-app-muted">No hay eventos agregados</p>
      )}

      {events.length > 0 && search.trim() !== "" && (
        <p className="text-start text-xs text-app-muted mb-2">
          {visibleEventsCount
            ? `${visibleEventsCount} de ${events.length} eventos coinciden con la búsqueda`
            : "Ningún evento coincide con la búsqueda"}
        </p>
      )}

      {/* Se oculta en vez de filtrar el arreglo: los handlers usan el índice original. */}
      {events.map((event, index) => matchesSearch(event) && (
        <div key={index} className="mb-2">
          <div className="bg-app-card border border-app-border rounded-xl mb-4 overflow-hidden shadow-sm">
            <div
              onClick={() => handleToggle(index)}
              className="bg-navy text-app-card py-3 px-4 flex justify-between items-center font-semibold cursor-pointer hover:bg-navy-dark"
            >
              Evento #{index + 1}
              <div className="flex items-center gap-4">
                <span
                  className={`inline-block transform transition-transform duration-200  cursor-pointer hover:text-red-600`}
                  onClick={() => handle_remove_event(index)}
                >
                  &#10005;
                </span>
                <span
                  className={`inline-block transform transition-transform duration-200 cursor-pointer ${expandedEvents[index] === true ? "rotate-180" : "rotate-0"}`}
                >
                  &#9660;
                </span>
              </div>
            </div>

            {expandedEvents[index] && (
              <div className="bg-app-card py-3 pb-4 px-6">
                <div className="grid sm:grid-cols-3 gap-4 items-start">
                  <h2 className="text-lg font-semibold text-navy col-span-3 text-start ">
                    Información de Referencia
                  </h2>

                  <div>
                    <label className="block text-xs text-app-muted mb-1">
                      NODO - MUNICIPIO PRIORIZADO
                    </label>
                    <Select
                      isMulti
                      value={
                        event.subregion?.map((subregionId) => {
                          const foundOption = municipios.find(
                            (option) => option.value === subregionId,
                          );
                          return (
                            foundOption || {
                              value: subregionId,
                              label: subregionId,
                            }
                          );
                        }) || []
                      }
                      options={municipiosOrdenados}
                      onChange={(selectedOptions) =>
                        handle_municipio(index, selectedOptions)
                      }
                      placeholder="Seleccionar Region"
                      menuPortalTarget={
                        typeof window !== "undefined" ? document.body : null
                      }
                      styles={styleSelect}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-app-muted mb-1">
                      OPERADOR PIC
                    </label>
                    <Select
                      name="operador"
                      options={operadores}
                      value={
                        event.operador_pic
                          ? {
                              value: event.operador_pic,
                              label:
                                operadores.find(
                                  (option) =>
                                    option.value === event.operador_pic,
                                )?.label || event.operador_pic,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handle_operador(index, selectedOption)
                      }
                      placeholder="Seleccionar Operador"
                      menuPortalTarget={
                        typeof window !== "undefined" ? document.body : null
                      }
                      styles={styleSelect}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-app-muted mb-1">
                      CODIGO - NOMBRE DEL TERRITORIO APS
                    </label>
                    <input
                      type="text"
                      value={event.codigo_nombre_territorio || ""}
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "codigo_nombre_territorio",
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border border-app-border rounded-md text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-app-muted mb-1">
                      CODIGO MICRO-TERRITORIO
                    </label>
                    <input
                      type="text"
                      value={event.codigo_micro_territorio || ""}
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "codigo_micro_territorio",
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border border-app-border rounded-md text-sm"
                    />
                  </div>

                  <div>
                    {anexoYear == OLD_ANEXO_DATE && (
                      <div>
                        <label className="block text-xs text-app-muted mb-1 uppercase">
                          Total número de Hogares Beneficiarios
                        </label>
                        <input
                          type="number"
                          value={event.total_hogares || ""}
                          onChange={(e) =>
                            handleEventChange(
                              index,
                              "total_hogares",
                              e.target.value,
                            )
                          }
                          className="w-full p-2 border border-app-border rounded-md text-sm"
                        />
                      </div>
                    )}
                    {anexoYear == NEW_ANEXO_DATE && (
                      <div>
                        <label className="block text-xs text-app-muted mb-1 uppercase">
                          N° De Poblacion a Intervenir
                        </label>
                        <input
                          type="number"
                          value={event.poblacion || ""}
                          onChange={(e) =>
                            handleEventChange(
                              index,
                              "poblacion",
                              e.target.value,
                            )
                          }
                          className="w-full p-2 border border-app-border rounded-md text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-navy col-span-3 text-start my-1 ">
                    {" "}
                    Datos del Evento
                  </h2>

                  <div>
                    <label className="block text-xs text-app-muted mb-1">
                      EQUIPO OPERATIVO
                    </label>
                    <select
                      name="equipo_operativo"
                      value={event.equipo_operativo || ""}
                      className="w-full p-2 pr-10 border border-app-border rounded-md text-sm cursor-pointer hover:bg-gray-200"
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "equipo_operativo",
                          e.target.value,
                        )
                      }
                    >
                      <option value="">Seleccionar Equipo</option>
                      {parametros.equipos.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-app-muted mb-1">
                      PERFIL PROFESIONAL
                    </label>
                    <textarea
                      type="text"
                      maxLength={2000}
                      value={event.perfil_profesional || ""}
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "perfil_profesional",
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border border-app-border rounded-md text-sm"
                    />
                    <p className="text-xs text-app-muted">
                      {event.perfil_profesional?.length || 0} / 2000 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-app-muted mb-1">
                      PERFIL OPERATIVO
                    </label>
                    <textarea
                      type="text"
                      maxLength={2000}
                      value={event.perfil_operativo || ""}
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "perfil_operativo",
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border border-app-border rounded-md text-sm"
                    />
                    <p className="text-xs text-app-muted">
                      {event.perfil_operativo?.length || 0} / 2000 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-app-muted mb-1">
                      PROYECTO IDSN RESPONSABLE
                    </label>
                    <Select
                      name="proyecto"
                      options={proyectos}
                      value={
                        event.proyecto
                          ? {
                              value: event.proyecto,
                              label:
                                proyectos.find(
                                  (option) => option.value === event.proyecto,
                                )?.label || event.proyecto,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handle_proyecto(index, selectedOption)
                      }
                      placeholder="Seleccionar Operador"
                      menuPortalTarget={
                        typeof window !== "undefined" ? document.body : null
                      }
                      styles={styleSelect}
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-xs text-app-muted mb-1 uppercase">
                      Descripción EVENTO
                    </label>
                    <textarea
                      type="text"
                      maxLength={2000}
                      value={event.description_event || ""}
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "description_event",
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border border-app-border rounded-md text-sm"
                    />
                    <p className="text-xs text-app-muted">
                      {event.description_event?.length || 0} / 2000 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-app-muted mb-1 uppercase">
                      nombre del indicador
                    </label>
                    <textarea
                      type="text"
                      maxLength={2000}
                      value={event.indicator_name || ""}
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "indicator_name",
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border border-app-border rounded-md text-sm"
                    />
                    <p className="text-xs text-app-muted">
                      {event.indicator_name?.length || 0} / 2000 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-app-muted mb-1 uppercase">
                      meta indicador
                    </label>
                    <textarea
                      type="text"
                      maxLength={2000}
                      value={event.meta_indicator || ""}
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "meta_indicator",
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border border-app-border rounded-md text-sm"
                    />
                    <p className="text-xs text-app-muted">
                      {event.meta_indicator?.length || 0} / 2000 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-app-muted mb-1 uppercase">
                      Ejes Estratégicos
                    </label>
                    <Select
                      isMulti
                      value={
                        event.eje_estrategico?.map((axis) => {
                          const foundOption = parametros.ejes.find(
                            (option) => option.value === axis,
                          );
                          return foundOption || { value: axis, label: axis };
                        }) || []
                      }
                      options={parametros.ejes}
                      onChange={(selectedOptions) =>
                        handleStrategicAxisChange(index, selectedOptions)
                      }
                      placeholder="Seleccionar ejes"
                      menuPortalTarget={
                        typeof window !== "undefined" ? document.body : null
                      }
                      styles={styleSelect}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-app-muted mb-1 uppercase">
                      Líneas Operativas
                    </label>
                    <select
                      name="lineas_operativas"
                      value={event.linea_operativa || ""}
                      className="w-full p-2 pr-10 border border-app-border rounded-md text-sm cursor-pointer hover:bg-gray-200"
                      onChange={(e) =>
                        handleEventChange(
                          index,
                          "linea_operativa",
                          e.target.value,
                        )
                      }
                    >
                      <option value="">Seleccionar Línea</option>
                      {parametros.lineas.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PRODUCTOS */}
                  <Product
                    product_data={event.product_data}
                    anexoYear={anexoYear}
                    entornos={parametros.entornos}
                    tecnologias={parametros.tecnologias}
                    poblaciones={parametros.poblaciones}
                    soportes={parametros.soportes}
                    cups={parametros.cups}
                    cursos_vida={parametros.cursos}
                    setProductData={(updatedProductData) => {
                      const updatedEvents = [...events];
                      updatedEvents[index].product_data = updatedProductData;
                      setEvents(updatedEvents);
                    }}
                    activities={event.activities}
                    setActivities={(activities) => {
                      const updatedEvents = [...events];
                      updatedEvents[index].activities = activities;
                      setEvents(updatedEvents);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="sticky bottom-0 bg-app-card border-t border-app-border py-4 px-6 flex justify-end items-center gap-4">
        <button
          className="w-full block bg-teal text-white rounded-lg p-3 text-lg font-semibold cursor-pointer hover:bg-teal-600"
          type="submit"
        >
          {eventsEdit && eventsEdit.length > 0
            ? "Actualizar Anexo"
            : "Crear Anexo"}
        </button>
      </div>
    </form>
  );
};
export default Event;

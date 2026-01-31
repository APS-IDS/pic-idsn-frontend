import React, { useState, useEffect } from "react";
import styles from "./Seguimiento.module.css";
import Header from "../Header/Header";
import Swal from "sweetalert2";
import { FaSave } from "react-icons/fa";
import { useSelector } from "react-redux";

import { useLocation } from "react-router-dom";

const Seguimiento = () => {
  const location = useLocation();
  const actividad = location.state?.actividad;

  const back = import.meta.env.VITE_APP_BACK;
  // const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  // const token = token_object.token;

  const token =
    useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;
  const url_soportes = `${back}/api/check-seguimiento?`;
  const url_observaciones = `${back}/api/observacio/read?`;
  const url_post_observaciones = `${back}/api/observaciones/register`;
  const url_post_check = `${back}/api/seguimiento/evidencia-status`;

  const url_estado_soportes = `${back}/api/estado-soportes`;

  const url_estado_operadores = `${back}/api/estado-operadors`;

  const url_estado_referentes = `${back}/api/estado-referentes`;

  const [soportes, setSoportes] = useState([]);

  const usuarioSession = JSON.parse(localStorage.getItem("usuario_rol"));
  const usuario_redux = useSelector((state) => state.user.usuario);
  const usuario = usuarioSession.usuario || usuario_redux;

  const documentId = actividad?.documentId;
  const uuid = actividad?.uuid;

  const [estadoSoportes, setEstadoSoportes] = useState([]);

  const [estados_back, setEstados_back] = useState([]);

  const [estados_operador, setEstados_operador] = useState([]);

  const [estados_referente, setEstados_referente] = useState([]);

  const [observaciones, setObservaciones] = useState({
    observacion_referente: "",
    observacion_operador: "",
    fecha_referente: "",
    fecha_operador: "",
    usuario_referente: "",
    usuario_operador: "",
  });

  const [status_porcentaje, setStatus] = useState({
    estado_referente: "",
    estado_operador: "",
    porcentaje_referente: "",
    porcentaje_operador: "",
  });

  useEffect(() => {
    Swal.fire({
      title: "Información",
      text: "Recuerda luego de realizar  cambios , dar clic en los botones de  Guardar para conservar los cambios",
      icon: "warning",
    });
  }, []);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const response = await fetch(`${url_estado_soportes}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener soportes.");
        const data = await response.json();
        //setSubregions(data.data);
        setEstados_back(data.data);
      } catch (error) {
        console.error("Error fetching subregions:", error);
      }
    };

    fetch_data();
  }, [token]);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const response = await fetch(`${url_estado_operadores}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener soportes.");
        const data = await response.json();

        setEstados_operador(data.data);

        //console.log("Estados operador_observacion:", data);
      } catch (error) {
        console.error("Error fetching subregions:", error);
      }
    };

    fetch_data();
  }, [token]);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const response = await fetch(`${url_estado_referentes}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener soportes.");
        const data = await response.json();

        setEstados_referente(data.data);

        // console.log("Estados operador_observacion:", data);
      } catch (error) {
        console.error("Error fetching subregions:", error);
      }
    };

    fetch_data();
  }, [token]);

  const onchange_status = (event) => {
    const property = event.target.name;
    let value = event.target.value;

    // Convertir a entero solo si es porcentaje
    if (
      property === "porcentaje_referente" ||
      property === "porcentaje_operador"
    ) {
      value = parseInt(value, 10) || 0; // Convierte y evita NaN con || 0
    }

    setStatus({ ...status_porcentaje, [property]: value });
  };

  const handleEstadoChange = (soporteId, nuevoEstado) => {
    setEstadoSoportes((prevState) => ({
      ...prevState,
      [soporteId]: nuevoEstado,
    }));
  };

  const onChange_observaciones = (event) => {
    const property = event.target.name;
    const value = event.target.value;
    setObservaciones({ ...observaciones, [property]: value });

    //console.log("Observaciones:", observaciones);

    // validate({ ...observaciones, [property]: value });
  };

  const handle_send = async () => {
    // event.preventDefault();

    //console.log("Porcentaaje:", status_porcentaje);

    const estado_seleccionado =
      usuario === "referente_instituto"
        ? estados_referente.find(
            (e) => e.estado_actividad === status_porcentaje.estado_referente,
          )
        : estados_operador.find(
            (e) => e.estado_actividad === status_porcentaje.estado_operador,
          );

    const documentId_estado = estado_seleccionado?.documentId || null;

    try {
      // setLoading(true);

      // Realizar la solicitud

      const response = await fetch(`${url_post_observaciones}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          observacion:
            usuario === "referente_instituto"
              ? observaciones.observacion_referente
              : observaciones.observacion_operador,
          anexo_id: documentId,
          porcentaje_completado:
            usuario === "referente_instituto"
              ? status_porcentaje.porcentaje_referente
              : status_porcentaje.porcentaje_operador,

          estado_referente:
            usuario === "referente_instituto"
              ? documentId_estado
              : // : "mqmr6ffj6imh24gareavq2q2",
                null,
          estado_operador:
            usuario === "referente_instituto"
              ? // ? "mm4070563cltcc6ie9yu5hjt"
                null
              : documentId_estado,

          // estado:
          //   usuario === "referente_instituto"
          //     ? status_porcentaje.estado_referente
          //     : status_porcentaje.estado_operador,

          id_actividad: uuid,
          // tipo: usuario === "referente_instituto" ? "referente" : "operador",
        }),
      });

      if (!response.ok) throw new Error("Error al enviar el reporte.");

      // setLoading(false);

      // Reiniciar el formulario
      Swal.fire({
        icon: "success",
        title: "¡Envío correcto!",
        text: "Informacion agregada correctamente!",
      });

      //resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor revise que todos los datos esten completos !",
      });
      console.error(error);
    }
  };

  const verSoporte = async (uuid) => {
    try {
      const response = await fetch(`${back}/api/seguimiento/get-file/${uuid}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // tu token JWT
        },
      });

      if (!response.ok) throw new Error("Error al obtener el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al obtener el archivo!",
      });
    }
  };

  const handle_send_check = async (id) => {
    // event.preventDefault();

    const estado_seleccionado = estados_back.find(
      (e) => e.estado_soporte === estadoSoportes[id],
    );

    try {
      // setLoading(true);

      // Realizar la solicitud

      const response = await fetch(`${url_post_check}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          anexo_id: documentId,
          soporte_id: id,
          //status: estadoSoportes[id],
          status_id: estado_seleccionado?.documentId,
        }),
      });

      if (!response.ok) throw new Error("Error al enviar el reporte.");

      // setLoading(false);

      // Reiniciar el formulario
      Swal.fire({
        icon: "success",
        title: "¡Envío correcto!",
        text: "Informacion agregada correctamente!",
      });

      //resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor revise que todos los datos esten completos !",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    if (!documentId || !uuid) return; // Evita hacer la petición si los valores son undefined

    const fetch_observacion = async () => {
      try {
        const response = await fetch(
          `${url_observaciones}anexo_id=${documentId}&id_actividad=${uuid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) throw new Error("Error al obtener observaciones.");
        const data = await response.json();

        const fecha_operador = data.operador?.fecha ?? "";
        const fecha_local_operador = fecha_operador
          ? new Date(fecha_operador).toLocaleString()
          : "";
        const fecha_referente = data.referente?.fecha ?? "";
        const fecha_local_referente = fecha_referente
          ? new Date(fecha_referente).toLocaleString()
          : "";

        // console.log("Data-Observacion-fecha", fechaLocal);
        setObservaciones((prev) => ({
          ...prev,
          observacion_referente:
            data.referente?.observacion ?? "Sin observación",
          observacion_operador: data.operador?.observacion ?? "Sin observación",
          fecha_operador: fecha_local_operador,
          fecha_referente: fecha_local_referente,
          usuario_operador: data.operador?.user.username,
          usuario_referente: data.referente?.user.username,
        }));

        setStatus((prev) => ({
          ...prev,
          estado_referente:
            data.referente?.estado_referente?.estado_actividad ?? "Sin Estado",
          estado_operador:
            data.operador?.estado_operador?.estado_actividad ?? "Sin Estado",
          porcentaje_operador: data.operador?.porcentaje_completado ?? 0,
          porcentaje_referente: data.referente?.porcentaje_completado ?? 0,
        }));
      } catch (error) {
        console.error("Error fetching observaciones", error);
      }
    };

    fetch_observacion();
  }, [token, documentId, uuid]);

  useEffect(() => {
    const fetchSoportes = async () => {
      if (!actividad || !actividad.soportes || actividad.soportes.length === 0)
        return;

      try {
        const requests = actividad.soportes.map(async (soporte) => {
          const response = await fetch(
            `${url_soportes}anexo_id=${actividad.documentId}&soporte_id=${soporte.uuid}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (!response.ok) return null; // Si la respuesta no es OK, devuelve null

          const data = await response.json();

          // console.log(
          //   "data_endpoint_soportes:",
          //   data?.estado_soporte?.estado_soporte ?? "sin estado"
          // );
          return { soporteId: soporte.uuid, data };
        });

        const results = await Promise.all(requests);

        // Obtener el estado anterior y conservar datos previos
        setSoportes((prevSoportes) => {
          const nuevosSoportes = { ...prevSoportes }; // Clonar el estado anterior

          results.forEach((result) => {
            if (result) {
              nuevosSoportes[result.soporteId] = result.data; // Solo actualiza los nuevos
            }
          });

          return nuevosSoportes; // Retorna el nuevo estado sin borrar datos previos
        });
        //data.estado_soporte.estado_soporte
        setEstadoSoportes((prevEstado) => {
          const nuevosEstados = { ...prevEstado };

          results.forEach((result) => {
            // if (result && result.data.estado) {
            //   nuevosEstados[result.soporteId] = result.data.estado;
            // }

            if (result?.data?.estado_soporte?.estado_soporte) {
              nuevosEstados[result.soporteId] =
                result.data.estado_soporte.estado_soporte;
            }
          });

          return nuevosEstados;
        });
      } catch (error) {
        console.error("Error fetching soportes:", error);
      }
    };

    fetchSoportes();
  }, [token, actividad]); // Se ejecuta cuando `actividad` o `token` cambian

  const getEmojiEstado = (estado) => {
    if (estado.includes("No Aprobado soporte fisico")) return "❌";
    if (estado.includes("No aprobado")) return "❌";
    if (estado.includes("Aprobado soporte fisico")) return "✅";
    if (estado.includes("Aprobado")) return "✅";
    return "❔";
  };

  const emojiPorEstadoReferente = {
    "Sin Reporte": "📄",
    "No aplica para periodo": "🚫",
    "Avance Limitado": "⚠️",
    "Actividad con avance": "📈",
    "Actividad cerrada": "✅",
    "Ajustar soportes": "🛠️",
  };

  const emojiPorEstadoOperador = {
    "No Aplica para periodo": "🚫",
    "Reporte Actualizado": "♻️",
    "Reporte de avance": "📈",
    "Sin avance": "⚠️",
  };

  return (
    <div className={styles.contenedor_principal}>
      <Header />

      <div className={styles.formContainer}>
        <table className={styles.table} style={{ marginBottom: "1rem" }}>
          <thead>
            <tr>
              <th>Descripción de Actividad</th>
              <th>Cantidad a Ejecutar</th>
              <th>Unidad de Medida</th>
              <th>Entornos</th>
              <th>Tecnologías</th>
              <th>Población Sujeto</th>
              <th>Soportes</th>
              <th>Código Cups</th>
              <th>Valor Unitario</th>
              <th>Valor Total</th>
              <th>Cronograma</th>
              <th>Observación Referente</th>
              <th>Estado Referente</th>
              <th>Observación Operador</th>
              <th>Estado Operador</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{actividad.descripcion}</td>
              <td>{actividad.cantidad_a_ejecutar}</td>
              <td>{actividad.unidad_medida}</td>
              <td>
                {actividad.entornos.map((entorno, index) => (
                  <p key={index}>{entorno.nombre}</p>
                ))}
              </td>
              <td>
                {actividad.tecnologias.map((tecno, index) => (
                  <p key={index}>{tecno.nombre}</p>
                ))}
              </td>
              <td>
                {actividad.poblaciones.map((poblacion, index) => (
                  <p key={index}>{poblacion.nombre}</p>
                ))}
              </td>

              <td>
                <table
                  className={styles.table_soportes}
                  style={{ marginBottom: "1rem" }}
                >
                  <thead>
                    <tr>
                      <th>Tipo Soporte</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Soportes</th>
                      {/* {usuario === "referente_instituto" && <th>Check</th>} */}
                      <th>Check</th>
                      {usuario === "referente_instituto" && <th>Guardar</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {actividad.soportes.map((soporte, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            width: "200px",
                            maxWidth: "200px",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          {soporte.tipo}
                        </td>
                        <td
                          style={{
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            maxWidth: "150px",
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {soporte.descripcion}
                          </p>
                        </td>
                        <td>{soporte.cantidad}</td>
                        <td>
                          <table className={styles.table_evidencias}>
                            <thead>
                              <tr>
                                <th>Nombre</th>
                                <th>Archivo</th>
                                <th>Región</th>
                              </tr>
                            </thead>
                            <tbody>
                              {soportes[soporte.uuid]?.evidencias?.length >
                              0 ? (
                                soportes[soporte.uuid].evidencias.map(
                                  (evidencia, i) => (
                                    <tr key={i}>
                                      <td>{evidencia.file_name}</td>
                                      <td>
                                        <button
                                          className={styles.edit_button}
                                          onClick={() =>
                                            verSoporte(evidencia.documentId)
                                          }
                                        >
                                          Ver soporte
                                        </button>

                                        {/* <a
                                          // href={`${back}${evidencia.archivo.url}`}
                                          href={`${back}/api/seguimiento/get-file/${soporte.uuid}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          Ver soporte
                                        </a> */}
                                      </td>
                                      <td>{evidencia.municipio.label}</td>
                                    </tr>
                                  ),
                                )
                              ) : (
                                <tr>
                                  <td
                                    colSpan="3"
                                    style={{ textAlign: "center" }}
                                  >
                                    No hay archivos
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </td>

                        <td>
                          {usuario === "referente_instituto" ? (
                            soportes[soporte.uuid]?.evidencias?.length > 0 ? (
                              <select
                                className={styles.select}
                                value={estadoSoportes[soporte.uuid] || ""}
                                onChange={(e) =>
                                  handleEstadoChange(
                                    soporte.uuid,
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="" disabled>
                                  🟡 Selecciona un estado
                                </option>
                                {estados_back.map((estado) => (
                                  // <option
                                  //   key={estado.id}
                                  //   value={estado.estado_soporte}
                                  // >
                                  //   {estado.estado_soporte}
                                  // </option>
                                  <option
                                    key={estado.id}
                                    value={estado.estado_soporte}
                                  >
                                    {getEmojiEstado(estado.estado_soporte)}{" "}
                                    {estado.estado_soporte}
                                  </option>
                                ))}
                              </select>
                            ) : null
                          ) : (
                            <p>
                              {estadoSoportes[soporte.uuid] ? (
                                <>
                                  {getEmojiEstado(estadoSoportes[soporte.uuid])}{" "}
                                  {estadoSoportes[soporte.uuid]}
                                </>
                              ) : (
                                <>❔ Sin check</>
                              )}
                            </p>
                          )}
                        </td>

                        {usuario === "referente_instituto" && (
                          //Boton envio de estado_check
                          <td>
                            {soportes[soporte.uuid]?.evidencias?.length > 0 && (
                              <button
                                className={styles.edit_button}
                                onClick={() => handle_send_check(soporte.uuid)}
                              >
                                <FaSave />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>

              <td>{actividad.cups.codigo}</td>
              <td>
                {actividad.valor_unitario
                  ? new Intl.NumberFormat("es-ES").format(
                      actividad.valor_unitario,
                    )
                  : ""}
              </td>
              <td>
                {actividad.valor_total
                  ? new Intl.NumberFormat("es-ES").format(actividad.valor_total)
                  : ""}
              </td>
              <td>
                <table
                  className={styles.subTable}
                  style={{ marginBottom: "1rem" }}
                >
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actividad.cronograma.map((crono, index) =>
                      Object.entries(crono).map(([mes, porcentaje]) =>
                        porcentaje > 0 ? (
                          <tr key={`${index}-${mes}`}>
                            <td>{mes}</td>
                            <td>{porcentaje}%</td>
                          </tr>
                        ) : null,
                      ),
                    )}
                  </tbody>
                </table>
              </td>
              <td>
                <table>
                  <thead>
                    <tr>
                      <th>Observacion</th>
                      {observaciones.fecha_referente && <th>Fecha</th>}
                      {observaciones.usuario_referente && <th>Usuario</th>}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {usuario === "referente_instituto" ? (
                          <textarea
                            className={styles.textarea}
                            name="observacion_referente"
                            type="text"
                            value={observaciones.observacion_referente}
                            onChange={onChange_observaciones}
                          />
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              padding: "5px",
                              fontSize: "16px",
                              width: "200px",
                            }}
                          >
                            {observaciones.observacion_referente}
                          </p>
                        )}
                      </td>
                      {observaciones.fecha_referente && (
                        <td>
                          {/* <span
                          style={{ display: "inline-block", width: "200px" }}
                        >
                          {observaciones.fecha_referente}
                        </span> */}

                          <p
                            style={{
                              margin: 0,
                              padding: "5px",
                              fontSize: "16px",
                              width: "200px",
                            }}
                          >
                            {observaciones.fecha_referente}
                          </p>

                          {/* {observaciones.fecha_referente} */}
                        </td>
                      )}
                      {observaciones.usuario_referente && (
                        <td>
                          <p
                            style={{
                              margin: 0,
                              padding: "5px",
                              fontSize: "16px",
                              width: "200px",
                            }}
                          >
                            {observaciones.usuario_referente}
                          </p>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </td>

              <td>
                <table>
                  <thead>
                    <tr>
                      <th>Porcentaje</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {usuario === "referente_instituto" ? (
                          <select
                            id="referente_porcentaje"
                            name="porcentaje_referente"
                            className={styles.select}
                            value={status_porcentaje.porcentaje_referente}
                            onChange={onchange_status}
                          >
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="10">10%</option>
                            <option value="15">15%</option>
                            <option value="20">20%</option>
                            <option value="25">25%</option>
                            <option value="30">30%</option>
                            <option value="35">35%</option>
                            <option value="40">40%</option>
                            <option value="45">45%</option>
                            <option value="50">50%</option>
                            <option value="55">55%</option>
                            <option value="60">60%</option>
                            <option value="65">65%</option>
                            <option value="70">70%</option>
                            <option value="75">75%</option>
                            <option value="80">80%</option>
                            <option value="85">85%</option>
                            <option value="90">90%</option>
                            <option value="95">95%</option>
                            <option value="100">100%</option>
                          </select>
                        ) : (
                          <p>{status_porcentaje.porcentaje_referente}%</p>
                        )}
                      </td>

                      <td>
                        {usuario === "referente_instituto" ? (
                          <select
                            id="referente"
                            name="estado_referente"
                            className={styles.select}
                            value={status_porcentaje.estado_referente}
                            onChange={onchange_status}
                          >
                            <option value="Sin Estado" disabled>
                              🟡 Selecciona un estado
                            </option>
                            {estados_referente?.map((estado) => (
                              <option
                                key={estado.id}
                                value={estado?.estado_actividad}
                                // title={estado.descripcion_estado}
                              >
                                {emojiPorEstadoReferente[
                                  estado?.estado_actividad
                                ] || "❓"}{" "}
                                {estado?.estado_actividad}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p>
                            {status_porcentaje.estado_referente && (
                              <>
                                {emojiPorEstadoReferente[
                                  status_porcentaje.estado_referente
                                ] || "❓"}{" "}
                                {status_porcentaje.estado_referente}
                              </>
                            )}
                          </p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>
                <table>
                  <thead>
                    <tr>
                      <th>Observacion</th>
                      {observaciones.fecha_operador && <th>Fecha</th>}
                      {observaciones.usuario_operador && <th>Usuario</th>}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {usuario === "operador" ? (
                          <textarea
                            className={styles.textarea}
                            name="observacion_operador"
                            type="text"
                            value={observaciones.observacion_operador}
                            onChange={onChange_observaciones}
                          />
                        ) : (
                          <p>{observaciones.observacion_operador}</p>
                        )}
                      </td>
                      {observaciones.fecha_operador && (
                        <td>
                          <p
                            style={{
                              margin: 0,
                              padding: "5px",
                              fontSize: "16px",
                              width: "200px",
                            }}
                          >
                            {observaciones.fecha_operador}
                          </p>
                        </td>
                      )}
                      {observaciones.usuario_operador && (
                        <td>
                          <p
                            style={{
                              margin: 0,
                              padding: "5px",
                              fontSize: "16px",
                              width: "200px",
                            }}
                          >
                            {observaciones.usuario_operador}
                          </p>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>Porcentaje</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {usuario === "operador" ? (
                          <select
                            id="operador"
                            name="porcentaje_operador"
                            className={styles.select}
                            value={status_porcentaje.porcentaje_operador}
                            onChange={onchange_status}
                          >
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="10">10%</option>
                            <option value="15">15%</option>
                            <option value="20">20%</option>
                            <option value="25">25%</option>
                            <option value="30">30%</option>
                            <option value="35">35%</option>
                            <option value="40">40%</option>
                            <option value="45">45%</option>
                            <option value="50">50%</option>
                            <option value="55">55%</option>
                            <option value="60">60%</option>
                            <option value="65">65%</option>
                            <option value="70">70%</option>
                            <option value="75">75%</option>
                            <option value="80">80%</option>
                            <option value="85">85%</option>
                            <option value="90">90%</option>
                            <option value="95">95%</option>
                            <option value="100">100%</option>
                          </select>
                        ) : (
                          <p>{status_porcentaje.porcentaje_operador}%</p>
                        )}
                      </td>

                      <td>
                        {usuario === "operador" ? (
                          <select
                            id="operador_status"
                            name="estado_operador"
                            className={styles.select}
                            value={status_porcentaje.estado_operador}
                            onChange={onchange_status}
                          >
                            <option value="Sin Estado" disabled>
                              🟡 Selecciona un estado
                            </option>
                            {estados_operador?.map((estado) => (
                              <option
                                key={estado.id}
                                value={estado?.estado_actividad}
                              >
                                {emojiPorEstadoOperador[
                                  estado?.estado_actividad
                                ] || "❔"}{" "}
                                {estado?.estado_actividad}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p>
                            {status_porcentaje.estado_operador && (
                              <>
                                {emojiPorEstadoOperador[
                                  status_porcentaje.estado_operador
                                ] || "❔"}{" "}
                                {status_porcentaje.estado_operador}
                              </>
                            )}
                          </p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td>
                <button className={styles.edit_button} onClick={handle_send}>
                  <FaSave />
                  Guardar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Seguimiento;

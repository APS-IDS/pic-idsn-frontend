import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import Swal from "sweetalert2";
import { Save } from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SoportesTable from "./SoportesTable";
import ObservacionPanel from "./ObservacionPanel";
import CronogramaTable from "./CronogramaTable";
import { CustomRoles } from "../../components/Login/constant";
import Spinner from "../Spinner/Spinner";
import { findActivity, toOptions, fetchJson, formatDate, formatAnexoDateForLabel } from "../../utils/seguimiento_events";
import InfoGeneralTable from "./InfoGeneralTable";


const Seguimiento = () => {
  const { documentId, actividadId } = useParams();
  const [loading, setLoading] = useState(false);
  const [actividad, setActividad] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [anexoDate, setAnexoDate] = useState(null);
  const [estadoSoportes, setEstadoSoportes] = useState([]);
  const [estados_back, setEstados_back] = useState([]);
  const [estados_operador, setEstados_operador] = useState([]);
  const [estados_referente, setEstados_referente] = useState([]);
  const [soportes, setSoportes] = useState([]);
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


  const token =
    useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;

  const back = import.meta.env.VITE_APP_BACK;
  const url_estado_soportes = `${back}/api/estado-soportes`;
  const url_estado_operadores = `${back}/api/estado-operadors`;
  const url_estado_referentes = `${back}/api/estado-referentes`;


  const url_soportes = `${back}/api/check-seguimiento?`;
  const url_observaciones = `${back}/api/observacio/read?`;
  const url_post_observaciones = `${back}/api/observaciones/register`;
  const url_post_check = `${back}/api/seguimiento/evidencia-status`;

  const usuarioSession = JSON.parse(localStorage.getItem("usuario_rol"));
  const usuario_redux = useSelector((state) => state.user.usuario);
  const usuario = usuarioSession.usuario || usuario_redux;

  const [cancelChange, setCancelChange] = useState(false);

  const fetchAnexo = async () => {
    const response = await fetch(
      `${back}/api/anexo-tecnicos/${documentId}?pLevel=11`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener el anexo técnico con ID ${documentId}: ${response.statusText}`);
    }

    const data = await response.json();
    const anexo = data?.data || null;

    return anexo;
  }



  const fetchStatesOptions = async () => {
    const [estadosSoportesData, estadosOperadorData, estadosReferenteData] = await Promise.allSettled([
      fetchJson(url_estado_soportes, token),
      fetchJson(url_estado_operadores, token),
      fetchJson(url_estado_referentes, token),
    ]);

    setEstados_back(estadosSoportesData.value?.data || []);
    setEstados_operador(estadosOperadorData.value?.data || []);
    setEstados_referente(estadosReferenteData.value?.data || []);
  }


  const fetch_observacion = async () => {
    const response = await fetch(
      `${url_observaciones}anexo_id=${documentId}&id_actividad=${actividadId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) throw new Error("Error al obtener observaciones.");
    const data = await response.json();
    setObservaciones((prev) => ({
      ...prev,
      observacion_referente: data.referente?.observacion ?? "Sin observación",
      observacion_operador: data.operador?.observacion ?? "Sin observación",
      fecha_operador: formatDate(data.operador),
      fecha_referente: formatDate(data.referente),
      usuario_operador: data.operador?.user?.username ?? "",
      usuario_referente: data.referente?.user?.username ?? "",
    }));

    setStatus((prev) => ({
      ...prev,
      estado_referente: data.referente?.estado_referente?.estado_actividad ?? "Sin Estado",
      estado_operador: data.operador?.estado_operador?.estado_actividad ?? "Sin Estado",
      porcentaje_operador: data.operador?.porcentaje_completado ?? 0,
      porcentaje_referente: data.referente?.porcentaje_completado ?? 0,
    }));

  };


  const fetchSoportes = async (actividad) => {
    if (!actividad || !actividad.soportes || actividad.soportes.length === 0)
      return;

    const requests = actividad.soportes.map(async (soporte) => {
      const response = await fetch(
        `${url_soportes}anexo_id=${documentId}&soporte_id=${soporte.uuid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) return null; // Si la respuesta no es OK, devuelve null

      const data = await response.json();

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

    setEstadoSoportes((prevEstado) => {
      const nuevosEstados = { ...prevEstado };

      results.forEach((result) => {

        if (result?.data?.estado_soporte?.estado_soporte) {
          nuevosEstados[result.soporteId] =
            result.data.estado_soporte.estado_soporte;
        }
      });

      return nuevosEstados;
    });
  };

  const loadAnexoAndSoportes = async () => {
    const anexoResult = await fetchAnexo();
    const actividadResult = await findActivity(actividadId, anexoResult);

    if (!actividadResult) {
      throw new Error(`No se encontró la actividad con ID ${actividadId} en el anexo técnico.`);
    }

    setActividad(actividadResult);
    setUuid(actividadId);
    setAnexoDate(anexoResult?.anexo_tecnico_date);

    await fetchSoportes(actividadResult);
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadAnexoAndSoportes(),
          fetch_observacion(),
          fetchStatesOptions()
        ]);

        Swal.fire({
          title: "Información",
          text: "Recuerda luego de realizar cambios, dar clic en los botones de Guardar para conservar los cambios",
          icon: "warning",
          confirmButtonText: "Entendido"
        });

      } catch (error) {

        console.error("Error al cargar los datos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Ocurrió un error al cargar los datos.",
        });

      } finally {
        setLoading(false);
      }
    };

    if (documentId && actividadId && token) {
      loadData();
    }

  }, [documentId, actividadId, token, cancelChange]);

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
  };

  const handle_send = async () => {
    // event.preventDefault();


    const estado_seleccionado =
      usuario === CustomRoles.REFERENTE_INSTITUTO
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
            usuario === CustomRoles.REFERENTE_INSTITUTO
              ? observaciones.observacion_referente
              : observaciones.observacion_operador,
          anexo_id: documentId,
          porcentaje_completado:
            usuario === CustomRoles.REFERENTE_INSTITUTO
              ? status_porcentaje.porcentaje_referente
              : status_porcentaje.porcentaje_operador,

          estado_referente:
            usuario === CustomRoles.REFERENTE_INSTITUTO
              ? documentId_estado
              : // : "mqmr6ffj6imh24gareavq2q2",
              null,
          estado_operador:
            usuario === CustomRoles.REFERENTE_INSTITUTO
              ? // ? "mm4070563cltcc6ie9yu5hjt"
              null
              : documentId_estado,

          // estado:
          //   usuario === CustomRoles.REFERENTE_INSTITUTO
          //     ? status_porcentaje.estado_referente
          //     : status_porcentaje.estado_operador,

          id_actividad: uuid,
          // tipo: usuario === CustomRoles.REFERENTE_INSTITUTO ? "referente" : "operador",
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

  const EMOJI_REFERENTE = {
    "Sin Reporte": "📄",
    "No aplica para periodo": "🚫",
    "Avance Limitado": "⚠️",
    "Actividad con avance": "📈",
    "Actividad cerrada": "✅",
    "Ajustar soportes": "🛠️",
  };

  const EMOJI_OPERADOR = {
    "No Aplica para periodo": "🚫",
    "Reporte Actualizado": "♻️",
    "Reporte de avance": "📈",
    "Sin avance": "⚠️",
  };

  if (loading) {
    return <Spinner envio={"Cargando datos, por favor espera..."} />;
  }

  if (!actividad) {
    return <div className="w-full h-screen flex items-center justify-center">No se encontró la actividad.</div>;
  }

  return (
    <div className=" bg-app-bg">
      <Header />
      <div className="max-w-6xl mx-auto min-h-dvh bg-app-bg p-4">
        <div className="flex align-center items-center gap-2 mb-4 text-app-muted">
          <a className="text-teal-dark hover:underline hover:bg-transparent text-md font-semibold" href="/view">&#8592;  Volver al listado</a>
          <span>/</span>
          <span className="m-2 font-light">Detalle de actividad</span>
          <span className="bg-yellow-brand text-amber-950 font-semibold text-sm py-1 px-2 rounded-3xl">ID {actividad.id}</span>
        </div>

        <InfoGeneralTable actividad={actividad} anexoDate={formatAnexoDateForLabel(anexoDate)} />

        <SoportesTable
          soportes={actividad.soportes}
          soportesData={soportes}
          estadoSoportes={estadoSoportes}
          estadosBack={estados_back}
          usuario={usuario}
          onVerSoporte={verSoporte}
          onEstadoChange={handleEstadoChange}
          onSendCheck={handle_send_check}
        />

        <CronogramaTable cronograma={actividad.cronograma} />

        <div className="grid grid-rows-1 md:grid-cols-2 gap-4 mt-4">

          <ObservacionPanel
            observacion={observaciones.observacion_referente}
            fecha={observaciones.fecha_referente}
            usuarioAutor={observaciones.usuario_referente}
            estado={status_porcentaje.estado_referente}
            porcentaje={status_porcentaje.porcentaje_referente}
            canEdit={usuario === CustomRoles.REFERENTE_INSTITUTO}
            name="referente"
            onChange={onChange_observaciones}
            onChangeState={onchange_status}
            estados={estados_referente}
            emojiMap={EMOJI_REFERENTE}
          />

          <ObservacionPanel
            observacion={observaciones.observacion_operador}
            fecha={observaciones.fecha_operador}
            usuarioAutor={observaciones.usuario_operador}
            estado={status_porcentaje.estado_operador}
            porcentaje={status_porcentaje.porcentaje_operador}
            canEdit={usuario === CustomRoles.OPERADOR}
            name="operador"
            onChange={onChange_observaciones}
            onChangeState={onchange_status}
            estados={estados_operador}
            emojiMap={EMOJI_OPERADOR}
          />

        </div>

        <div className="sticky  border border-app-border rounded-xl bg-white border-t-app-border py-3 px-5 flex justify-end gap-2 mt-1 shadow-md ">
          <button className="py-2 px-6 text-sm cursor-pointer border rounded-md hover:bg-gray-200 font-semibold" onClick={() => { setCancelChange(!cancelChange); }}>Cancelar</button>

          <button className="flex items-center gap-2 bg-teal text-white py-2 px-6 text-sm cursor-pointer border rounded-md hover:bg-teal-dark font-semibold "
            onClick={handle_send}>
            <Save className="w-4 h-4" />
            Guardar seguimiento</button>

        </div>
      </div>
    </div>


  );
};

export default Seguimiento;

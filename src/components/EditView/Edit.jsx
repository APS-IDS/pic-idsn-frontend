import React, { useState, useEffect, act } from "react";
import Event from "../Event/Event";
import { useLocation, useParams } from "react-router-dom";
import Header from "../Header/Header";
import Swal from "sweetalert2";
import Spinner from "../Spinner/Spinner";
import { useSelector } from "react-redux";
import { fetchAnexo } from "../../utils/api";
import { transformEvent } from "../../utils/const_forms";

const Edit = () => {
  const { documentId } = useParams();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anexo, setAnexo] = useState(location.state?.anexo || {});
  const token = useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;
  const fetchData = async () => {
    try {
      setLoading(true);
      const anexoResult = await fetchAnexo(documentId, token);
      setEvents(anexoResult.eventos.map((ev) => transformEvent(ev)));
      setAnexo({ id: anexoResult.id, documentId: anexoResult.documentId });
    }
    catch (error) {
      console.error("Error fetching anexo:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
    Swal.fire({
      title: "Información",
      text: "Recuerda luego de realizar  cambios , dar clic en el boton Guardar para conservar los cambios",
      icon: "warning",
    });
  }, [documentId, token]);

  if (loading) return <Spinner envio={"Cargando datos, por favor espera..."} />;

  return (
    <div className="bg-app-bg">
      <Header />
      <div className="max-w-6xl mx-auto min-h-dvh bg-app-bg p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-2xl font-bold text-navy mb-2 text-start flex items-center gap-2">
              <span className="bg-yellow-brand text-amber-950 font-semibold text-lg py-1 px-2 rounded-3xl">
                ID {anexo.id}
              </span>
              Editar Anexo Técnico
            </div>
            <p className="text-sm text-app-muted text-start">
              Un anexo puede tener varios eventos · cada evento varios productos ·
              cada producto varios indicadores y actividades · cada actividad
              varios soportes.
            </p>
          </div>
        </div>
        <Event
          eventsEdit={events}
          anexo={anexo}
          onSaved={fetchData}
        />
      </div>
    </div>
  );
};

export default Edit;

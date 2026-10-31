export const findActivity = async (actividadId, anexo) => {
  const eventos = anexo?.eventos || [];
  for (const evento of eventos) {
    for (const producto of evento.productos || []) {
      const actividad = (producto.actividades || []).find(
        (act) => act.uuid === actividadId,
      );
      if (actividad) return actividad;
    }
  }
  return null;
};

export const toOptions = (result, campo) =>
  (result.value?.data || []).map((item) => ({
    value: item[campo],
    label: item[campo],
  }));

export const fetchJson = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export const formatDate = ( rol ) => {
  const fecha = rol?.fecha ?? "";
  return fecha ? new Date(fecha).toLocaleString() : "";
};


export const formatAnexoDateForLabel = (anexoDate) => {
  return anexoDate ? anexoDate.slice(0, 4) : "";
};

// Hay algo nuevo que guardar si el rol ("referente" u "operador") cambió su
// observación, porcentaje o estado respecto a lo último guardado.
export const hasSeguimientoChanges = (rol, saved, current) => {
  if (!rol || !saved) return false;

  const valueOf = ({ observaciones, status }, campo) =>
    String({ ...observaciones, ...status }[`${campo}_${rol}`] ?? "");

  return ["observacion", "porcentaje", "estado"].some(
    (campo) => valueOf(saved, campo) !== valueOf(current, campo),
  );
};

// El estado de un soporte se puede guardar si se eligió uno distinto al guardado.
export const hasEstadoSoporteChange = (saved, current, soporteId) =>
  Boolean(current[soporteId]) && current[soporteId] !== saved[soporteId];

// El referente cierra el seguimiento de una actividad marcándola "Actividad
// cerrada" al 100%; desde entonces ya no se puede modificar (el backend
// también lo valida).
export const ESTADO_ACTIVIDAD_CERRADA = "Actividad cerrada";

export const isSeguimientoCerrado = (estado, porcentaje) =>
  estado === ESTADO_ACTIVIDAD_CERRADA && Number(porcentaje) === 100;

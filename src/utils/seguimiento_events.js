export const identifyActivity = (actividadId, anexo) => {
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

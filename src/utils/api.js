   const back = import.meta.env.VITE_APP_BACK;
   export const fetchAnexo = async (documentId, token) => {
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
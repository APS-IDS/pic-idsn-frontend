import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import styles from "./ReporView.module.css";
import Spinner from "../Spinner/Spinner";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import withReactContent from "sweetalert2-react-content";
import qs from "qs";
import FiltersPanel from "./FiltersPanel";
import AnexoCard from "./AnexoCard";
import { openSoporteModal } from "./soporteModal.jsx";
import { ANIOS_DISPONIBLES } from "../../utils/const_forms";

const ReportView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [operatorFilterValue, setOperatorFilterValue] = useState("");
  const [filterState, setFilterState] = useState(
    {
      project: null,
      operator: null,
      municipality: null,
      dependence: null,
      anio: null,
    });

  const [appliedFilters, setAppliedFilters] = useState({
    proyecto: null,
    operador: null,
    municipality: null,
    dependence: null,
    anio: null,
  });


  const [anexoDate, setYanexoDate] = useState("");
  const [nombre, setNombre] = useState("");

  const [openIndex, setOpenIndex] = useState(null);
  const user_Redux = useSelector((state) => state.user.usuario);
  const user_LS = JSON.parse(localStorage.getItem("usuario_rol"));
  const usuario = user_Redux || user_LS?.usuario || "";
  const back = import.meta.env.VITE_APP_BACK;

  const token =
    useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;

  const url_municipios = `${back}/api/municipios?pagination[pageSize]=100`;


  // filtros traidos de backend
  const [proyectos, setProyectos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [dependences, setDependences] = useState([]);
  const anios = ANIOS_DISPONIBLES;
  const [isOpen, setIsOpen] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // validar con el instituto esta parte

  const getGteDate = (dateString) => {
    // Year-only (e.g., '2025') -> Jan 1 at UTC midnight
    if (/^\d{4}$/.test(dateString)) {
      const year = Number(dateString);
      return new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)).toISOString();
    }
    // Full date -> that day at UTC midnight
    const d = new Date(dateString);
    return new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0),
    ).toISOString();
  };

  const getLteDate = (dateString) => {
    // Year-only (e.g., '2025') -> Dec 31 at UTC midnight
    if (/^\d{4}$/.test(dateString)) {
      const year = Number(dateString);
      return new Date(Date.UTC(year, 11, 31, 0, 0, 0, 0)).toISOString();
    }
    // Full date -> that day at UTC midnight
    const d = new Date(dateString);
    return new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0),
    ).toISOString();
  };


  const url_anexos = `${back}/api/anexo-tecnicos?`;
  const url_soportes = `${back}/api/seguimiento/upload-file`;
  const url_soportes_get = `${back}/api/check-seguimiento?`;
  const url_soportes_delete = `${back}/api/seguimiento/remove-file`;
  const url_operadores = `${back}/api/operador-pics?pagination[pageSize]=200`;
  const url_proyectos = `${back}/api/proyectos-idsns`;

  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const showLoadingSwal = (mensaje, mensaje_2) => {
    MySwal.fire({
      title: mensaje_2,
      html: <Spinner envio={mensaje} />, // Aquí se muestra el spinner
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);

        // Traer Toda la Consulta de Filtros
        const response = await fetch(`${url_municipios}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProyectos([]);
        setMunicipios([]);
        setOperadores([]);
        setDependences([]);

        if (response.ok)
          throw new Error(`HTTP error! Status:`);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFilterOptions();
  }, []);


  const fetchData = async () => {

    setLoadingData(true);

    const cleanParams = Object.fromEntries(
      Object.entries(appliedFilters).filter(([_, val]) => val !== null && val !== "")
    );

    const anexosQuery = qs.stringify(
      {
        pLevel: 10,
        pagination: { page: currentPage, pageSize },
        filters: {
          ...(cleanParams.anio
            ? {
              anexo_tecnico_date: {
                $gte: getGteDate(cleanParams.anio),
                $lte: getLteDate(cleanParams.anio),
              },
            }
            : {}),
          eventos: {
            ...(cleanParams.project
              ? { proyectos_idsn: { proyecto: { $containsi: cleanParams.project } } }
              : {}),
            ...(cleanParams.operator
              ? {
                operador_pic: {
                  operador_pic: { $containsi: cleanParams.operator },
                },
              }
              : {}),
          },
        },
      },
      { encodeValuesOnly: true },
    );

    try {
      //const response = await fetch(`${url_anexos}${anexosQuery}`);

      const response = await fetch("/anexo-tecnico-response.json");
      console.log(response);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error consultando datos:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    token,
    appliedFilters,
    currentPage,
    pageSize,
    filterState,
  ]);



  if (loading) return <Spinner envio={"Cargando datos, por favor espera..."} />;
  if (error) return <div>Error: {error}</div>;



  const handle_click = (evento) => {
    navigate("/edit", {
      state: {
        evento: evento, // Pasa aquí los datos que necesitas
      },
    });
  };


  const handle_click_actividad = (actividad, anexoDate) => {
    navigate("/seg", {
      state: {
        actividad: actividad, // Pasa aquí los datos que necesitas
        anexoDate: anexoDate,
      },
    });
  };

  const handle_soporte = async (documentId, soporteId) => {
    try {
      const response = await fetch(
        `${url_soportes_get}anexo_id=${documentId}&soporte_id=${soporteId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      let existingData = null;
      if (response.ok) {
        existingData = await response.json();
      } else if (response.status === 404) {
        console.warn("No se encontraron datos para este soporte.");
        existingData = null;
      } else {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }

      const hasExistingData = existingData?.evidencias?.length > 0;

      const result = await openSoporteModal({
        Swal,
        municipios,
        hasExistingData,
        existingEvidencias: existingData?.evidencias || [],
        onDeleteExisting: async (evidenciaId) => {
          await deleteEvidencia(evidenciaId, documentId, soporteId);
        },
      });

      if (!result.isConfirmed) {
        return;
      }

      const evidenciasAEnviar = result.value;

      for (const evidencia of evidenciasAEnviar) {
        try {
          showLoadingSwal(
            "Enviando soportes, por favor espera ...,",
            "Enviando Soportes...",
          );

          if (evidencia.tipo === "link") {
            const response = await fetch(`${back}/api/seguimiento/upload-link`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                anexo_id: documentId,
                soporte_id: soporteId,
                municipio_id: evidencia.region,
                file_name: evidencia.file_name,
                evidencia_link: evidencia.evidencia_link,
              }),
            });

            if (!response.ok) throw new Error("Error al enviar el enlace");
          } else {
            const formData = new FormData();
            formData.append("anexo_id", documentId);
            formData.append("soporte_id", soporteId);
            formData.append("municipio_id", evidencia.region);
            formData.append("files", evidencia.archivo);

            const response = await fetch(`${url_soportes}`, {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) throw new Error("Error al enviar los datos");
          }

          Swal.close();
        } catch (error) {
          console.error("Error:", error);
          Swal.fire("Error", "Hubo un problema al enviar los datos.", "error");
          return;
        }
      }

      Swal.fire("¡Éxito!", "Todos los soportes fueron enviados.", "success");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "No se pudieron obtener los datos.", "error");
    }
  };

  const deleteEvidencia = async (evidenciaId, documentId, soporteId) => {
    // console.log("evidenciaId", evidenciaId);
    // console.log("documentId", documentId);
    // console.log("soporteId", soporteId);

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la evidencia permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          showLoadingSwal(
            "Eliminando soporte, por favor espera ...",
            "Eliminado soportes...",
          );
          const response = await fetch(`${url_soportes_delete}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              anexo_id: documentId,
              soporte_id: soporteId,
              evidencia_id: evidenciaId,
            }),
          });

          if (!response.ok) throw new Error("Error al eliminar la evidencia");

          Swal.close();

          Swal.fire(
            "Eliminado",
            "La evidencia ha sido eliminada con éxito.",
            "success",
          );

          // Volver a cargar la lista de soportes después de eliminar
          handle_soporte(documentId, soporteId);
        } catch (error) {
          console.error("Error:", error);
          Swal.fire(
            "Error",
            "Hubo un problema al eliminar la evidencia.",
            "error",
          );
        }
      }
    });
  };

  const handleFilterChange = (key, value) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
  };
  const handleApplyFilters = () => {
    setAppliedFilters(filterState);
    setCurrentPage(1);
  };



  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleClear = () => {
  setFilterState({
    project: null,
    municipality: null,
    anio: null,
    operator: null,
    dependence: null,
    filterState: null,
  });
};

  return (
    <>
      <Header />
      <div class="w-full h-[1050px] bg-app-bg pt-4">
        <FiltersPanel
          filters={[
            {
              key: "project",
              label: "Proyecto",
              text: "Todos los proyectos",
              optionsList: proyectos,
              value: filterState.project,
            },
            {
              key: "municipality",
              label: "Municipio",
              text: "Todos los municipios",
              optionsList: municipios,
              value: filterState.municipality,
            },
            {
              key: "anio",
              label: "Año",
              text: "Todos los años",
              optionsList: anios,
              value: filterState.anio,
            },

            {
              key: "operator",
              label: "Operador",
              text: "Todos los operadores",
              optionsList: operadores,
              value: filterState.operator,
            },
            {
              key: "dependence",
              label: "Dependencia",
              text: "Todas las dependencias",
              optionsList: dependences,
              value: filterState.dependence,
            },
          ]}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          loading={loadingData}
          onClear={handleClear}
        />

        {loadingData ? (
          <Spinner envio={"Cargando datos, por favor espera..."} />
        ) : (
          data?.data && data.data.length > 0 ? (data?.data?.map((anexo, index) => (
            <AnexoCard
              key={anexo.documentId}
              row={anexo}
              index={index}
              usuario={usuario}
              filterValue={filterValue}
              operatorFilterValue={operatorFilterValue}
              onEdit={handle_click}
              onSoporte={handle_soporte}
              onActividad={handle_click_actividad}
              handleToggle={handleToggle}
              openIndex={openIndex}
            />
          ))) : (
            <div class={styles.noDataMessage}>
              No hay información para mostrar
            </div>
          ))}
        {/*
        <div class={styles.formContainer}>
          {data?.data && data.data.length > 0 ? (
            data.data.map((row, index) => (
              <AnexoCard
                key={row.documentId}
                row={row}
                index={index}
                usuario={usuario}
                filterValue={filterValue}
                operatorFilterValue={operatorFilterValue}
                onEdit={handle_click}
                onSoporte={handle_soporte}
                onActividad={handle_click_actividad}
              />
            ))
          ) : (
            <div class={styles.noDataMessage}>
              No hay información para mostrar
            </div>
          )}

          <div class={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            <span>Página {currentPage}</span>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={data?.meta?.pagination?.pageCount === currentPage}
            >
              Siguiente
            </button>
          </div>
        </div>
*/}
      </div>


    </>
  );
};

export default ReportView;

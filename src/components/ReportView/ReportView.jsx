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
const ReportView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState(""); // Estado para el filtro
  const [operatorFilterValue, setOperatorFilterValue] = useState(""); // Filtro por operador

  // const anexoDate = "2025";

  const [anexoDate, setYanexoDate] = useState("");

  const [nombre, setNombre] = useState("");

  const user_Redux = useSelector((state) => state.user.usuario);

  const user_LS = JSON.parse(localStorage.getItem("usuario_rol"));

  // console.log("datos_usuario", user);

  const usuario = user_Redux || user_LS?.usuario || "";

  // console.log("Usuario session", usuario);
  // console.log("Usuario Redux", usuarioRedux);

  const back = import.meta.env.VITE_APP_BACK;

  const token =
    useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;

  const url_municipios = `${back}/api/municipios?pagination[pageSize]=100`;
  const [municipios, setMunicipios] = useState([]);

  const [operadores, setOperadores] = useState([]);

  const [proyectos, setProyectos] = useState([]);

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

  const anexosQuery = qs.stringify(
    {
      pLevel: 10,
      pagination: { page: currentPage, pageSize },
      filters: {
        ...(anexoDate
          ? {
              anexo_tecnico_date: {
                $gte: getGteDate(anexoDate),
                $lte: getLteDate(anexoDate),
              },
            }
          : {}),
        eventos: {
          ...(filterValue
            ? { proyectos_idsn: { proyecto: { $containsi: filterValue } } }
            : {}),
          ...(operatorFilterValue
            ? {
                operador_pic: {
                  operador_pic: { $containsi: operatorFilterValue },
                },
              }
            : {}),
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const url_anexos = `${back}/api/anexo-tecnicos?${anexosQuery}`;

  const url_soportes = `${back}/api/seguimiento/upload-file`;
  const url_soportes_get = `${back}/api/check-seguimiento?`;
  const url_soportes_delete = `${back}/api/seguimiento/remove-file`;

  const url_operadores = `${back}/api/operador-pics?pagination[pageSize]=200`;

  const url_proyectos = `${back}/api/proyectos-idsns`;

  const navigate = useNavigate(); // Hook para navegación

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
    const fetchData = async () => {
      try {
        const response = await fetch(url_anexos, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    token,
    filterValue,
    operatorFilterValue,
    anexoDate,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    const fetch_subregion = async () => {
      try {
        const response = await fetch(`${url_municipios}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener subregiones.");
        const data = await response.json();
        //setSubregions(data.data);
        setMunicipios(data.data);
      } catch (error) {
        console.error("Error fetching subregions:", error);
      }
    };

    fetch_subregion();
  }, [token]);

  useEffect(() => {
    const fetch_operador = async () => {
      try {
        const response = await fetch(`${url_operadores}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener subregiones.");
        const data = await response.json();

        setOperadores(data.data);
        // console.log("Operadores", data.data);
      } catch (error) {
        console.error("Error fetching operador:", error);
      }
    };

    fetch_operador();
  }, [token]);

  // console.log("Operadores_Estado:", operadores);

  useEffect(() => {
    const fetch_proyectos = async () => {
      try {
        const response = await fetch(`${url_proyectos}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener subregiones.");
        const data = await response.json();
        //setSubregions(data.data);
        // setMunicipios(data.data);
        setProyectos(data.data);
      } catch (error) {
        console.error("Error fetching operador:", error);
      }
    };

    fetch_proyectos();
  }, [token]);

  // console.log("proyectos_estado:", proyectos);

  if (loading) return <Spinner envio={"Cargando datos, por favor espera..."} />;
  if (error) return <div>Error: {error}</div>;

  //console.log("datos", data);

  const handle_click = (evento) => {
    navigate("/edit", {
      state: {
        evento: evento, // Pasa aquí los datos que necesitas
      },
    });
  };
  //console.log("Year", anexoDate);

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

  return (
    <div className={styles.contenedor_principal}>
      <Header />

      <FiltersPanel
        proyectos={proyectos}
        operadores={operadores}
        filterValue={filterValue}
        operatorFilterValue={operatorFilterValue}
        anexoDate={anexoDate}
        onProjectChange={(val) => {
          setFilterValue(val);
          setCurrentPage(1);
        }}
        onOperatorChange={(val) => {
          setOperatorFilterValue(val);
          setCurrentPage(1);
        }}
        onYearChange={(val) => {
          setYanexoDate(val);
          setCurrentPage(1);
        }}
      />

      <div className={styles.formContainer}>
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
          <div className={styles.noDataMessage}>
            No hay información para mostrar
          </div>
        )}

        <div className={styles.pagination}>
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
    </div>
  );
};

export default ReportView;

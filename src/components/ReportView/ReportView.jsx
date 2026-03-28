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

  // console.log("datos", data);

  const handle_click = (evento) => {
    navigate("/edit", {
      state: {
        evento: evento, // Pasa aquí los datos que necesitas
      },
    });
  };

  const handle_click_actividad = (actividad) => {
    navigate("/seg", {
      state: {
        actividad: actividad, // Pasa aquí los datos que necesitas
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

      let evidenciasHTML = "";

      // 🔹 Mostrar evidencias existentes con botón de eliminar
      if (hasExistingData) {
        evidenciasHTML = existingData.evidencias
          .map(
            (evidencia, index) => `
            <div id="evidencia-existente-${
              evidencia.documentId
            }" style="margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; 
        border-radius: 5px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
              <div  style="flex: 1; min-width: 200px;">
                <p><strong>Soporte ${index + 1}:</strong></p>
                <p><strong>Archivo:</strong> ${evidencia.file_name}</p>
                <p><strong>Región:</strong> ${evidencia.municipio.label}</p> 
              </div>
           <div>
          <button class="swal2-confirm btn-delete" data-evidencia-id="${
            evidencia.documentId
          }" style="background-color: red; color: white; padding: 5px 10px; border: none; border-radius:5px ;cursor: pointer;">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div> 

            </div>
          `,
          )
          .join("");
      }

      // 🔹 Nueva lista para evidencias a enviar
      let nuevasEvidencias = [];

      // 🔹 Formulario para agregar nuevas evidencias
      evidenciasHTML += `
        <button id="add-evidencia" class="swal2-confirm" style="background-color: green; color: white; margin-top: 10px; padding: 5px 10px; border: none;border-radius: 5px; pointer;">
          Agregar Nuevo Soporte
        </button>
        <div id="extra-evidencias" style="margin-top: 10px;"></div>
      `;

      Swal.fire({
        title: hasExistingData ? "Soportes Actuales" : "Ingrese la Información",
        html: evidenciasHTML,
        showCancelButton: true,
        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",

        didOpen: () => {
          const extraEvidenciasDiv =
            document.getElementById("extra-evidencias");

          // Evento para eliminar evidencias existentes
          document.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", async (event) => {
              const evidenciaId =
                // event.target.getAttribute("data-evidencia-id");
                event.currentTarget.getAttribute("data-evidencia-id");

              await deleteEvidencia(evidenciaId, documentId, soporteId);
              document.getElementById(`evidencia-existente-${evidenciaId}`);
            });
          });

          // Evento para manejar la selección de archivos
          document.querySelectorAll("[id^=botonpersonal-]").forEach((btn) => {
            btn.addEventListener("click", (event) => {
              const evidenciaId = event.currentTarget.id.split("-")[1];
              document.getElementById(`archivo-${evidenciaId}`).click();
            });
          });

          // Evento para actualizar el texto del archivo adjunto
          document.querySelectorAll("[id^=archivo-]").forEach((input) => {
            input.addEventListener("change", (event) => {
              const evidenciaId = event.target.id.split("-")[1];
              const fileName =
                event.target.files.length > 0
                  ? event.target.files[0].name
                  : "No hay archivos adjuntos";
              document.getElementById(`tagsmall-${evidenciaId}`).textContent =
                fileName;
            });
          });

          // Evento para agregar nueva evidencia
          document
            .getElementById("add-evidencia")
            .addEventListener("click", () => {
              const evidenciaId = `evidencia-${nuevasEvidencias.length}`;
              const newEvidenciaHTML = `
              <div id="${evidenciaId}" style="margin-bottom: 10px; padding: 10px; border: 1px solid #ccc;
                border-radius: 5px; display: flex; justify-content: space-between; align-items: center; gap: 10px; width: 100%;">
        
                <div style="flex: 1; min-width: 200px;">
                  <label for="region-${evidenciaId}" style="margin-top: 10px;margin-left:40px">Seleccionar Región:</label>
                  <select id="region-${evidenciaId}" class="swal2-select" style="width: 100%; margin-top: 5px;">
                    <option value="">Selecciona una región</option>
                    ${municipios
                      .map(
                        (muni) =>
                          `<option value="${muni.documentId}">${muni.label}</option>`,
                      )
                      .join("")}
                  </select>
        
                  <label for="archivo-${evidenciaId}" style="margin-top: 10px; margin-left:40px;">Archivo Soporte:</label>
                  <input type="file" hidden id="archivo-${evidenciaId}" class="swal2-file">
                  <button id="botonpersonal-${evidenciaId}" style="margin-left:40px; background-color:rgb(84, 138, 196); color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">
                    Adjuntar documento
                  </button>
                <span id="tagsmall-${evidenciaId}" 
                 style="margin-left:40px; display: block; margin-top:20px; 
                 padding: 5px 10px; border: 1px solid #ccc; border-radius: 5px; 
                 color: #333; font-size: 18px;">
                 No hay archivos adjuntos
                </span>

                </div>
        
                <div style="display: flex; align-items: center; justify-content: flex-end; min-width: 80px;">
                  <button class="swal2-confirm btn-delete-evidencia" data-id="${evidenciaId}"
                    style="background-color: red; color: white; padding: 10px; border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 5px;">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
        
              </div>
            `;

              extraEvidenciasDiv.insertAdjacentHTML(
                "beforeend",
                newEvidenciaHTML,
              );
              nuevasEvidencias.push(evidenciaId);

              // Agregar eventos a los nuevos elementos creados dinámicamente
              document
                .getElementById(`botonpersonal-${evidenciaId}`)
                .addEventListener("click", () => {
                  document.getElementById(`archivo-${evidenciaId}`).click();
                });

              document
                .getElementById(`archivo-${evidenciaId}`)
                .addEventListener("change", (event) => {
                  const fileName =
                    event.target.files.length > 0
                      ? event.target.files[0].name
                      : "No hay archivos adjuntos";
                  document.getElementById(
                    `tagsmall-${evidenciaId}`,
                  ).textContent = fileName;
                });

              document
                .querySelector(`[data-id="${evidenciaId}"]`)
                .addEventListener("click", (event) => {
                  const id = event.currentTarget.getAttribute("data-id");
                  document.getElementById(id)?.remove();
                  nuevasEvidencias = nuevasEvidencias.filter((e) => e !== id);
                });
            });
        },
        preConfirm: async () => {
          if (nuevasEvidencias.length === 0) {
            Swal.showValidationMessage("Debes agregar al menos una evidencia.");
            return false;
          }

          return nuevasEvidencias.map((id) => ({
            region: document.getElementById(`region-${id}`).value,
            archivo: document.getElementById(`archivo-${id}`).files[0],
          }));
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const evidenciasAEnviar = result.value;

          for (const evidencia of evidenciasAEnviar) {
            if (!evidencia.region || !evidencia.archivo) {
              Swal.fire(
                "Error",
                "Todos los soportes deben tener región y archivo. Por favor intente nuevamente",
                "error",
              );
              return;
            }

            try {
              showLoadingSwal(
                "Enviando soportes, por favor espera ...,",
                "Enviando Soportes...",
              );
              // setLoading(true);
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

              // console.log("Evidencia enviada:", await response.json());
              Swal.close();
            } catch (error) {
              console.error("Error:", error);
              Swal.fire(
                "Error",
                "Hubo un problema al enviar los datos.",
                "error",
              );
              return;
            }
          }

          Swal.fire(
            "¡Éxito!",
            "Todos los soportes fueron enviados.",
            "success",
          );
        } else {
          // console.log("El usuario canceló el popup");
        }
      });
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

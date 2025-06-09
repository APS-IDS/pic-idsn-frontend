import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import styles from "./ReporView.module.css";
import Spinner from "../Spinner/Spinner";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";
import { useSelector } from "react-redux";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select"; // Importamos React Select

const ReportView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState(""); // Estado para el filtro
  const [operatorFilterValue, setOperatorFilterValue] = useState(""); // Filtro por operador

  const [nombre, setNombre] = useState("");

  const usuario_object = JSON.parse(sessionStorage.getItem("usuario")) || {};

  // const usuario = usuario_object.usuario;

  const usuario = useSelector((state) => state.user.usuario);

  const back = import.meta.env.VITE_APP_BACK;
  const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  const token = token_object.token;

  const url_municipios = `${back}/api/municipios?pagination[pageSize]=100`;
  const [municipios, setMunicipios] = useState([]);

  const [operadores, setOperadores] = useState([]);

  const [proyectos, setProyectos] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // validar con el instituto esta parte
  const url_anexos = `${back}/api/anexo-tecnicos?pLevel=10&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}${
    filterValue
      ? `&filters[eventos][proyectos_idsn][proyecto][$eq]=${filterValue}`
      : ""
  }${
    operatorFilterValue
      ? `&filters[eventos][operador_pic][operador_pic][$eq]=${operatorFilterValue}`
      : ""
  }`;

  const url_soportes = `${back}/api/seguimiento/upload-file`;
  const url_soportes_get = `${back}/api/check-seguimiento?`;
  const url_soportes_delete = `${back}/api/seguimiento/remove-file`;

  const url_operadores = `${back}/api/operador-pics?pagination[pageSize]=100`;

  const url_proyectos = `${back}/api/proyectos-idsns`;

  const navigate = useNavigate(); // Hook para navegación

  // const customStyles = {
  //   control: (base) => ({
  //     ...base,
  //     minWidth: "280px", // Ajusta el ancho mínimo
  //     //maxWidth: "400px", // Opcional, limita el ancho máximo
  //   }),
  //   menu: (base) => ({
  //     ...base,
  //     zIndex: 5, // Asegura que el menú no se superponga
  //   }),
  //   option: (base) => ({
  //     ...base,
  //     whiteSpace: "nowrap", // Evita que el texto se parta
  //   }),
  //   multiValueLabel: (base) => ({
  //     ...base,
  //     whiteSpace: "normal", // Permite que las etiquetas ocupen más espacio
  //   }),
  // };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "2px 5px",
      width: "1000px",
      fontSize: "16px",
      border: state.isFocused ? "1px solid #007bff" : "1px solid #ccc",
      borderRadius: "5px",
      backgroundColor: "white",
      boxShadow: "none", // elimina el sombreado por defecto
      cursor: "pointer",
      "&:hover": {
        borderColor: "#007bff",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "#007bff"
        : state.isFocused
        ? "#e6f0ff"
        : "white",
      color: state.isSelected ? "white" : "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  //Paginacion

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
  }, [token, filterValue, operatorFilterValue, currentPage, pageSize]);

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
        }
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
                <p><strong>Archivo:</strong> ${evidencia.archivo.name}</p>
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
          `
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
                event.target.getAttribute("data-evidencia-id");

              await deleteEvidencia(evidenciaId, documentId, soporteId);
              document.getElementById(`evidencia-existente-${evidenciaId}`);
            });
          });

          // Evento para manejar la selección de archivos
          document.querySelectorAll("[id^=botonpersonal-]").forEach((btn) => {
            btn.addEventListener("click", (event) => {
              const evidenciaId = event.target.id.split("-")[1];
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
                          `<option value="${muni.documentId}">${muni.label}</option>`
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
                newEvidenciaHTML
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
                    `tagsmall-${evidenciaId}`
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
                "error"
              );
              return;
            }

            try {
              showLoadingSwal(
                "Enviando soportes, por favor espera ...,",
                "Enviando Soportes..."
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

              console.log("Evidencia enviada:", await response.json());
              Swal.close();
            } catch (error) {
              console.error("Error:", error);
              Swal.fire(
                "Error",
                "Hubo un problema al enviar los datos.",
                "error"
              );
              return;
            }
          }

          Swal.fire(
            "¡Éxito!",
            "Todos los soportes fueron enviados.",
            "success"
          );
        } else {
          console.log("El usuario canceló el popup");
        }
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "No se pudieron obtener los datos.", "error");
    }
  };

  const deleteEvidencia = async (evidenciaId, documentId, soporteId) => {
    console.log("evidenciaId", evidenciaId);
    console.log("documentId", documentId);
    console.log("soporteId", soporteId);

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
            "Eliminado soportes..."
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
            "success"
          );

          // Volver a cargar la lista de soportes después de eliminar
          handle_soporte(documentId, soporteId);
        } catch (error) {
          console.error("Error:", error);
          Swal.fire(
            "Error",
            "Hubo un problema al eliminar la evidencia.",
            "error"
          );
        }
      }
    });
  };

  // Obtener lista única de valores para el menú desplegable
  const projectOptions = [
    ...new Set(
      data?.data?.flatMap((row) =>
        row.eventos.map((evento) => evento.proyectos_idsn?.proyecto)
      )
    ),
  ].filter(Boolean); // Filtrar valores no válidos (null, undefined)

  // Obtener lista única de valores para el menú desplegable de operadores

  const operatorOptions = [
    ...new Set(
      data?.data?.flatMap((row) =>
        row.eventos.flatMap(
          (evento) =>
            // evento.productos.map((producto) => producto.operador_pic.operador_pic)
            evento?.operador_pic?.operador_pic
        )
      )
    ),
  ].filter(Boolean);

  // Filtrar datos basados en los valores seleccionados
  const filteredData = data?.data
    ?.map((row) => ({
      ...row,
      eventos: row.eventos.filter(
        (evento) =>
          (!filterValue || evento.proyectos_idsn?.proyecto === filterValue) &&
          (!operatorFilterValue ||
            evento?.operador_pic?.operador_pic === operatorFilterValue)
      ),
    }))
    .filter((row) => row.eventos.length > 0);

  return (
    <div className={styles.contenedor_principal}>
      <Header />

      {/* Menú desplegable para filtrar */}
      <div className={styles.filterContainer}>
        <div className={styles.container_label}>
          <label htmlFor="proyectoFilter">Filtrar por Proyecto IDSN:</label>
        </div>

        <Select
          name="proyecto"
          options={[
            { value: "", label: "Todos los proyectos" }, // opción "Todos"
            ...proyectos.map((option) => ({
              value: option.proyecto,
              label: option.proyecto,
            })),
          ]}
          value={
            filterValue
              ? {
                  value: filterValue,
                  label:
                    proyectos.find((p) => p.proyecto === filterValue)
                      ?.proyecto || filterValue,
                }
              : { value: "", label: "Todos los proyectos" }
          }
          onChange={(selectedOption) => {
            setFilterValue(selectedOption?.value || "");
            setCurrentPage(1);
          }}
          placeholder="Seleccionar proyecto"
          styles={customStyles} // opcional: puedes definir tu propio estilo
          // className={styles.filterSelect} // o puedes seguir usando tus estilos CSS
        />

        {/* <select
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.filterSelect}
        >
          <option value="">Todos los proyectos</option>

          {proyectos.map((option) => (
            <option key={option.id} value={option.proyecto}>
              {option.proyecto}
            </option>
          ))}
        </select> */}
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.container_label}>
          <label htmlFor="operatorFilter">Filtrar por Operador:</label>
        </div>

        {/* <select
          value={operatorFilterValue}
          onChange={(e) => {
            setOperatorFilterValue(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.filterSelect}
        >
          <option value="">Todos los operadores</option> */}
        {/* {operatorOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))} */}
        {/* {operadores.map((option) => (
            <option key={option.id} value={option.operador_pic}>
              {option.operador_pic}
            </option>
          ))}
        </select> */}

        <Select
          name="operador"
          options={[
            { value: "", label: "Todos los operadores" }, // opción "Todos"
            ...operadores.map((option) => ({
              value: option.operador_pic,
              label: option.operador_pic,
            })),
          ]}
          value={
            operatorFilterValue
              ? {
                  value: operatorFilterValue,
                  label:
                    operadores.find(
                      (o) => o.operador_pic === operatorFilterValue
                    )?.operador_pic || operatorFilterValue,
                }
              : { value: "", label: "Todos los operadores" }
          }
          onChange={(selectedOption) => {
            setOperatorFilterValue(selectedOption?.value || "");
            setCurrentPage(1);
          }}
          placeholder="Seleccionar operador"
          styles={customStyles}
          // className={styles.filterSelect} // reutilizas tu clase si quieres
        />
      </div>
      <div className={styles.formContainer}>
        {/* {filteredData?.map((row, index) => */}
        {data?.data?.map((row, index) =>
          row.eventos.map((evento) => (
            <table key={`${index}-${evento.id}`} className={styles.table}>
              <thead>
                <tr>
                  <th>Nodo - Municipio Priorizado</th>
                  <th>Operador Pic</th>
                  <th>Código - Nombre de Territorio APS</th>
                  <th>Código Micro-Territorio</th>
                  <th>Total número de Hogares Beneficiarios</th>
                  <th>Equipo Operativo</th>
                  <th>Perfil Profesional</th>
                  <th>Perfil Operativo</th>
                  <th>Proyecto IDSN Responsable</th>
                  <th>Descripción Evento</th>
                  <th>Nombre del Indicador</th>
                  <th>Meta Indicador</th>
                  <th>Ejes Estratégicos</th>
                  <th>Lineas Operativas</th>
                  {(filterValue || operatorFilterValue) != "" && (
                    <th>Productos</th>
                  )}
                  {usuario === "referente_instituto" && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <table>
                      <tbody>
                        {Array.isArray(
                          evento?.territorializacion?.municipios
                        ) && evento.territorializacion.municipios.length > 0 ? (
                          evento.territorializacion.municipios.map(
                            (muni, index) => (
                              <tr key={index}>
                                <td>{muni.label}</td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td>Informacion sin ingresar</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>

                  <td>{evento?.operador_pic?.operador_pic}</td>
                  <td>{evento?.territorializacion?.territorio || ""}</td>
                  <td>
                    {evento?.territorializacion?.microterritorio ||
                      "Falta ingresar "}
                  </td>
                  <td>
                    {evento?.territorializacion?.numero_hogares ||
                      "No hay hogares"}
                  </td>
                  <td>{evento?.equipo}</td>
                  <td>{evento?.perfiles_profesional}</td>
                  <td>{evento?.perfil_operativo}</td>
                  <td>{evento?.proyectos_idsn?.proyecto}</td>
                  <td>{evento?.descripcion}</td>
                  <td>{evento?.indicador_evento}</td>
                  <td>{evento?.meta_indicador_evento}</td>
                  <td>
                    <table>
                      <tbody>
                        {evento?.ejes_estrategicos?.map((eje) => (
                          <tr key={eje.id}>
                            <td>{eje.nombre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>

                  <td>{evento?.lineas_operativa?.nombre}</td>
                  {(filterValue || operatorFilterValue) != "" && (
                    <td>
                      <table>
                        <tbody>
                          {evento.productos.map((producto) => (
                            <tr key={producto.id || producto.descripcion}>
                              <td
                                key={producto.id || producto.descripcion}
                                colSpan="4"
                              >
                                <table className={styles.subTable}>
                                  <thead>
                                    <tr>
                                      <th>Descripcion del producto</th>
                                      <th>Indicadores</th>
                                      <th>Actividades</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{producto.descripcion}</td>

                                      {/* Indicadores */}
                                      <td>
                                        <table className={styles.subTable}>
                                          <thead>
                                            <tr>
                                              <th>Indicador linea base</th>
                                              <th>Cantidad</th>
                                              <th>Meta Producto</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {producto.indicadores.map(
                                              (indicador, index) => (
                                                <tr key={indicador.id || index}>
                                                  <td>
                                                    {
                                                      indicador.indicador_linea_base
                                                    }
                                                  </td>
                                                  <td>{indicador.cantidad}</td>
                                                  <td>
                                                    {indicador.meta_producto}
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </table>
                                      </td>

                                      {/* Actividades */}
                                      <td>
                                        {producto.actividades.map(
                                          (actividad, index) => (
                                            <table
                                              key={actividad.id || index}
                                              className={styles.subTable}
                                            >
                                              <thead>
                                                <tr>
                                                  <th>
                                                    Descripción de Actividad
                                                  </th>
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
                                                  <th>Acciones</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    {actividad.descripcion}
                                                  </td>
                                                  <td>
                                                    {
                                                      actividad.cantidad_a_ejecutar
                                                    }
                                                  </td>
                                                  <td>
                                                    {actividad.unidad_medida}
                                                  </td>

                                                  {/* Entornos */}
                                                  <td>
                                                    <table>
                                                      <tbody>
                                                        {actividad.entornos.map(
                                                          (entorno) => (
                                                            <tr
                                                              key={entorno.id}
                                                            >
                                                              <td>
                                                                {entorno.nombre}
                                                              </td>
                                                            </tr>
                                                          )
                                                        )}
                                                      </tbody>
                                                    </table>
                                                  </td>

                                                  {/* Tecnologías */}
                                                  <td>
                                                    <table>
                                                      <tbody>
                                                        {actividad.tecnologias.map(
                                                          (tecno, i) => (
                                                            <tr
                                                              key={
                                                                tecno.id || i
                                                              }
                                                            >
                                                              <td>
                                                                {tecno.nombre}
                                                              </td>
                                                            </tr>
                                                          )
                                                        )}
                                                      </tbody>
                                                    </table>
                                                  </td>

                                                  {/* Poblaciones */}
                                                  <td>
                                                    <table>
                                                      <tbody>
                                                        {actividad.poblaciones.map(
                                                          (poblacion, i) => (
                                                            <tr
                                                              key={
                                                                poblacion.id ||
                                                                i
                                                              }
                                                            >
                                                              <td>
                                                                {
                                                                  poblacion.nombre
                                                                }
                                                              </td>
                                                            </tr>
                                                          )
                                                        )}
                                                      </tbody>
                                                    </table>
                                                  </td>

                                                  {/* Soportes */}
                                                  <td>
                                                    <table
                                                      className={
                                                        styles.subTable
                                                      }
                                                    >
                                                      <thead>
                                                        <tr>
                                                          <th>Tipo Soporte</th>
                                                          <th>Descripción</th>
                                                          <th>Cantidad</th>
                                                          {usuario ===
                                                            "operador" && (
                                                            <th>Acciones</th>
                                                          )}
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {actividad.soportes.map(
                                                          (soporte, i) => (
                                                            <tr
                                                              key={
                                                                soporte.id || i
                                                              }
                                                            >
                                                              <td>
                                                                {soporte.tipo}
                                                              </td>
                                                              <td>
                                                                {
                                                                  soporte.descripcion
                                                                }
                                                              </td>
                                                              <td>
                                                                {
                                                                  soporte.cantidad
                                                                }
                                                              </td>
                                                              {(soporte.cantidad ??
                                                                0) > 0 &&
                                                                usuario ===
                                                                  "operador" && (
                                                                  <td>
                                                                    <button
                                                                      onClick={() =>
                                                                        handle_soporte(
                                                                          row.documentId,
                                                                          soporte.uuid
                                                                        )
                                                                      }
                                                                      className={
                                                                        styles.edit_button
                                                                      }
                                                                    >
                                                                      <FaPaperclip />{" "}
                                                                      Soporte
                                                                    </button>
                                                                  </td>
                                                                )}
                                                            </tr>
                                                          )
                                                        )}
                                                      </tbody>
                                                    </table>
                                                  </td>

                                                  <td>
                                                    {actividad.cups.codigo}
                                                  </td>
                                                  <td>
                                                    <table>
                                                      <tbody>
                                                        <tr>
                                                          <td>
                                                            {/* {actividad.valor_unitario} */}

                                                            {actividad.valor_unitario
                                                              ? new Intl.NumberFormat(
                                                                  "es-ES"
                                                                ).format(
                                                                  actividad.valor_unitario
                                                                )
                                                              : ""}
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td>
                                                    {/* {actividad.valor_total} */}
                                                    <div
                                                      style={{
                                                        border:
                                                          "1px solid #c0bcbc",
                                                        padding: "5px",
                                                        display: "inline-block",
                                                      }}
                                                    >
                                                      {actividad.valor_total
                                                        ? new Intl.NumberFormat(
                                                            "es-ES"
                                                          ).format(
                                                            actividad.valor_total
                                                          )
                                                        : ""}
                                                    </div>
                                                  </td>

                                                  {/* Cronograma */}
                                                  <td>
                                                    <table
                                                      className={
                                                        styles.subTable
                                                      }
                                                    >
                                                      <thead>
                                                        <tr>
                                                          <th>Mes</th>
                                                          <th>Porcentaje</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {actividad.cronograma.map(
                                                          (crono, i) =>
                                                            Object.entries(
                                                              crono
                                                            ).map(
                                                              ([
                                                                mes,
                                                                porcentaje,
                                                              ]) =>
                                                                porcentaje >
                                                                0 ? (
                                                                  <tr
                                                                    key={`${i}-${mes}`}
                                                                  >
                                                                    <td>
                                                                      {mes}
                                                                    </td>
                                                                    <td>
                                                                      {
                                                                        porcentaje
                                                                      }
                                                                      %
                                                                    </td>
                                                                  </tr>
                                                                ) : null
                                                            )
                                                        )}
                                                      </tbody>
                                                    </table>
                                                  </td>

                                                  {/* Acciones */}
                                                  <td>
                                                    <button
                                                      className={
                                                        styles.seguimiento_button
                                                      }
                                                      onClick={() =>
                                                        handle_click_actividad({
                                                          ...actividad,
                                                          documentId:
                                                            row.documentId,
                                                        })
                                                      }
                                                    >
                                                      <FaClipboardList
                                                        style={{
                                                          marginRight: "5px",
                                                        }}
                                                      />
                                                      Seguimiento
                                                    </button>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          )
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  )}
                  {usuario === "referente_instituto" && (
                    <td>
                      <button
                        className={styles.edit_button}
                        onClick={() =>
                          handle_click({
                            ...evento,
                            documentId: row.documentId,
                          })
                        }
                      >
                        <FaEdit style={{ marginRight: "5px" }} />
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          ))
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
            disabled={data?.meta?.pagination?.pageCount === currentPage} // Esto evita ir más allá del total de páginas.
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportView;

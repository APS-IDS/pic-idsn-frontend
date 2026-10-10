import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Bardouble from "./Bardouble";
import Dona from "./DonaProducto";
import Spinner from "../Spinner/Spinner";
import { useDispatch } from "react-redux";
import { get_user } from "../../redux/actions";
import { useSelector } from "react-redux";
import { mapToChartData } from "../../utils/constDashBoard";
import FiltersPanel from "../ReportView/FiltersPanel";
import { filtersDashboard, FILTERS } from "../../utils/constDashBoard";
import { toastError, toastSuccess } from "../../utils/toast";
import PanelResume from "./PanelResume";

const teal = "#0f7a68";
const tealMid = "#14947f";
const tealLight = "#7fc9ba";
const navy = "#1c3a5e";
const navyLight = "#4a6d94";
const yellow = "#f2c94c";
const green = "#8bc34a";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import LineaMes from "./LineaMeses";
import { ANIOS_DISPONIBLES } from "../../utils/const_forms";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
);

const Dashbo = () => {
  const [globalData, setGlobalData] = useState(null);
  const [panelCard, setPanelCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterState, setFilterState] = useState(FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(FILTERS);
  const [filterOptions, setFilterOptions] = useState(FILTERS);

  const back = import.meta.env.VITE_APP_BACK;
  const url_municipios = `${back}/api/municipios?pagination[pageSize]=100`;
  const url_operadores = `${back}/api/operador-pics?pagination[pageSize]=200`;
  const url_proyectos = `${back}/api/proyectos-idsns`;
  const url_estados = `${back}/api/estado-referentes`;

  const dispatch = useDispatch();
  const url_data_total = `${back}/api/dashboard-all`;
  const activeFilters = filtersDashboard(filterOptions, filterState);
  const token =
    useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;

  const fetchData = async () => {
    setLoading(true);
    const { anio, project, operator, municipality, estado } = appliedFilters;
    // gestionar los query params dinamicamente
    const params = new URLSearchParams();

    // agregar cada param si tiene un valor valido
    if (anio) params.append("dateFilter", anio);
    if (project) params.append("projectId", project);
    if (municipality) params.append("municipioId", municipality);
    if (operator) params.append("operadorId", operator);
    if (estado) params.append("estadoObservacioneReferenteId", estado);

    // URL final concatenando 
    const queryString = params.toString();
    const url_builder = queryString ? `${url_data_total}?${queryString}` : url_data_total;

    try {
      const response = await fetch(url_builder, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(
          `Error al obtener los datos del tablero: ${response.status}`,
        );
      }
      const data = await response.json();
      setGlobalData(data);

      // modificar aqui los valores de los paneles, Resumen
      setPanelCard({
        events: 100,
        activities: 50,
        products: 1000,
        supports: 80,
      });
    } catch (error) {
      console.error("Error cargando los datos del tablero:", error);
      toastError("No se pudieron cargar los datos del tablero");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, appliedFilters]);

  useEffect(() => {
    dispatch(get_user());
  }, [dispatch]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);

        // Traer Toda la Consulta de Filtros
        const fetchJson = async (url) => {
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

        const [municipiosResult, operadoresResult, proyectosResult, estadosResult] =
          await Promise.allSettled([
            fetchJson(url_municipios),
            fetchJson(url_operadores),
            fetchJson(url_proyectos),
            fetchJson(url_estados)
          ]);

        // campoValue define qué se envía al backend; campoLabel, qué se muestra
        const toOptions = (result, campoLabel, campoValue = campoLabel) =>
          (result.value?.data || []).map((item) => ({
            value: item[campoValue],
            label: item[campoLabel],
            documentId: item.documentId,
          }));

        setFilterOptions({
          municipios: toOptions(municipiosResult, "label", "documentId"),
          operadores: toOptions(operadoresResult, "operador_pic", "documentId"),
          proyectos: toOptions(proyectosResult, "proyecto", "documentId"),
          anios: ANIOS_DISPONIBLES.map((anio) => ({
            value: anio,
            label: anio,
          })),
          // Espera de los estados pertinentes
          estados: toOptions(estadosResult, "estado_actividad", "documentId"),
        });
      } catch (error) {
        console.error("Error cargando opciones de filtros:", error);
        toastError("No se pudieron cargar las opciones de filtros");
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return (
    <div className=" bg-app-bg">
      <Header />
      <div className="flex min-h-[calc(100vh-56px)]">
        <Sidebar />
        <div className="px-6 flex-col w-full gap-5 py-4">
          <p className="font-bold uppercase text-navy py-3">
            Filtros de búsqueda
          </p>
          <FiltersPanel
            filters={activeFilters}
            loading={loading}
            filterEmptyState={FILTERS}
            filterState={filterState}
            setFilterState={setFilterState}
            setAppliedFilters={setAppliedFilters}
          />
          <p className="font-bold uppercase text-navy py-3">Resumen</p>
          <PanelResume data={panelCard} />
          <p className="font-bold uppercase text-navy py-3">Indicadores</p>
          {loading ? (
            <Spinner envio={"Cargando datos, por favor espera..."} />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Bardouble
                title="Eventos por Municipio"
                data={mapToChartData(globalData?.municipiosEventos, {
                  labelsField: "municipio",
                  valuesField: "eventos",
                  color: tealMid,
                })}
                color={tealMid}
              />

              <Bardouble
                title="Eventos por Operador"
                data={mapToChartData(globalData?.eventosOperador, {
                  labelsField: "operador",
                  valuesField: "eventos",
                  color: navyLight,
                })}
                color={tealMid}
              />

              <Dona
                title="Porcentaje de Actividades Según Población"
                data={mapToChartData(globalData?.actividadesPoblacion, {
                  color: [teal, yellow, navy, navyLight, tealLight],
                  type: "doughnut",
                })}
              />

              <Dona
                title="Porcentaje de Actividades Según Entorno"
                data={mapToChartData(globalData?.actividadesEntorno, {
                  color: [teal, navy, navyLight, tealLight],
                  type: "doughnut",
                })}
              />

              <Bardouble
                title="Cantidad de Productos Según Proyecto"
                data={mapToChartData(globalData?.productosProyecto, {
                  labelsField: "proyecto",
                  valuesField: "productos",
                  color: yellow,
                })}
                color={tealMid}
              />

              <Dona
                title="Cantidad de Soportes Según Estado"
                data={mapToChartData(globalData?.soportesEstado, {
                  color: [teal, navy, navyLight],
                })}
              />

              <LineaMes
                title="Cantidad de Actividades por Mes"
                data={mapToChartData(globalData?.actividadesMes, {
                  type: "line",
                  color: green,
                })}
              />

              <Bardouble
                title="Cantidad de Actividades por Tecnología"
                data={mapToChartData(globalData?.actividadesTecnologia, {
                  color: tealLight,
                })}
                color={tealMid}
              />

              <Dona
                title="Porcentaje de Estado por Actividades"
                data={mapToChartData(globalData?.actividadesPorEstado, {
                  color: [teal, navy, navyLight],
                })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashbo;

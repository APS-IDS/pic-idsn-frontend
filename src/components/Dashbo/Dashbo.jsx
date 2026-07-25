import React, { useRef, useState, useEffect } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Dashboard.module.css";
import { Card, CardContent, Typography } from "@mui/material";
import Bardouble from "./Bardouble";
import PieGraphic from "./Pie";
import imagen from "../../assets/mapa_nariño.png";
import LocationCityIcon from "@mui/icons-material/LocationCity"; // Importa el icono
import Dona from "./DonaProducto";
import DonaActividad from "./DonaActividades";
import RadarEntorno from "./RadarEntorno";
import Spinner from "../Spinner/Spinner";
import { useDispatch } from "react-redux";
import { get_data, get_user } from "../../redux/actions";
import { useSelector } from "react-redux";
import RadarCheckActividad from "./RadarCheckActividad";

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
import { Bar, Doughnut, PolarArea, Chart, Line } from "react-chartjs-2";
import BarraPoblacion from "./BarraPoblacion";
import LineaMes from "./LineaMeses";
import RadarCheck from "./RadarCheck";
import DonaEstado from "./DonaEstado";

const ANIOS_DISPONIBLES = ["2025", "2026"];

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
  const back = import.meta.env.VITE_APP_BACK;
  const url_usuarios = `${back}/api/users/me?pLevel=2`;
  const [anioSeleccionado, setAnioSeleccionado] = useState("2026");
  const globalData = useSelector((state) => state.data);
  const usuario_redux = useSelector((state) => state.user);
  const loading_redux = useSelector((state) => state.GET_DATA);
  const dispatch = useDispatch();
  const loading = !globalData || Object.keys(globalData).length === 0;
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    dispatch(get_data(anioSeleccionado));
  }, [anioSeleccionado]);

  useEffect(() => {
    dispatch(get_user());
  }, [dispatch]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setAnioSeleccionado(selectedValue);
  };

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.main}>
        <Sidebar />

        <div className={styles.container}>
          <div className={styles.select_container}>
            <h1 style={{ marginBottom: "30px" }}>Filtros de Búsqueda</h1>
            <div>
              <label htmlFor="">Selecciona el Año</label>
              <select
                name=""
                id=""
                onChange={handleSelectChange}
                value={anioSeleccionado}
              >
                {ANIOS_DISPONIBLES.map((anio) => (
                  <option key={anio} value={anio}>
                    {anio}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.bardouble}>
            <Bardouble />
          </div>

          <div className={styles.barra_poblacion}>
            <BarraPoblacion />
          </div>

          <div className={styles.radar_entorno}>
            <RadarEntorno />
          </div>

          <div className={styles.dona_producto}>
            <Dona />
          </div>

          <div className={styles.radar_check}>
            <RadarCheck />
          </div>

          <div className={styles.dona_actividad}>
            <DonaActividad />
          </div>

          <div className={styles.dona_actividad_estado}>
            <DonaEstado />
          </div>

          <div className={styles.linea_mes}>
            <LineaMes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbo;

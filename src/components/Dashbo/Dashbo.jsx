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
import { get_data } from "../../redux/actions";
import { useSelector } from "react-redux";
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
  RadialLinearScale
);

const productos_proyecto = [
  {
    mes: "Medicamentos-Prestación de servicios de salud con calidad para la paz",
    cantidad: 10,
  },
  {
    mes: "Salud para Población de Especial Protección para la paz",
    cantidad: 20,
  },
  {
    mes: "PAI -Prevención de enfermedades transmisibles para la paz",
    cantidad: 15,
  },
  {
    mes: "Garantía de derechos sexuales y reproductivos para la paz",
    cantidad: 30,
  },
  { mes: "Atención Primaria En Salud", cantidad: 25 },
  { mes: "Emergencias-Salud Ambiental para la Paz", cantidad: 35 },
  { mes: "Nutrición y alimentación saludable para la Paz", cantidad: 40 },
];

const operador_evento = [
  {
    mes: "E.S.E. Hospital San Andrés - Tumaco",
    cantidad: 10,
  },
  {
    mes: "E.S.E. Hospital el Buen Samaritano - La Cruz",
    cantidad: 20,
  },
  {
    mes: "E.S.E. Hospital Departamental de Nariño",
    cantidad: 15,
  },
  {
    mes: "E.S.E. Centro de Salud de Puerres",
    cantidad: 30,
  },
  { mes: "E.S.E. Hospital Clarita Santos - Sandoná", cantidad: 25 },
  { mes: "E.S.E. Centro de Salud de Ancuyá - Nariñoz", cantidad: 35 },
  { mes: "E.S.E. Centro de Salud - Consacá", cantidad: 40 },
];

const Dashbo = () => {
  const back = import.meta.env.VITE_APP_BACK;
  const url_usuarios = `${back}/api/users/me?pLevel=2`;
  const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  const token = token_object.token;

  const [usuario_dos, setUsuario_dos] = useState(null);
  const [super_usuario, setSuper] = useState(null);
  const [data_municipios, setDataMunicipios] = useState([]);

  const [activeDataset, setActiveDataset] = useState("eventos");

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const url_cantidad_eventos = `${back}/api/dashboard-all`;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_data(token));
  }, [dispatch]);

  const globalData = useSelector((state) => state.data);
  const loading = !globalData || Object.keys(globalData).length === 0;

  console.log("Estado loading", loading);

  useEffect(() => {
    const fetch_user = async () => {
      try {
        const response = await fetch(`${url_usuarios}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener usuarios.");

        const data = await response.json();
        const datos = {
          usuario: data.custom_roles[0].name,
          user_name: data.username,
        };

        if (data.custom_roles.length > 1) {
          setSuper(true);
        }

        console.log("data_usuario", data);
        console.log("datos", datos);

        sessionStorage.setItem("usuario", JSON.stringify(datos));

        setUsuario_dos(datos.usuario);

        console.log("super_user", super_usuario);
        //setSubregions(data.data);
        // setMunicipios(data.data);
      } catch (error) {
        console.error("Error fetching subregions:", error);
      }
    };

    fetch_user();
  }, [token]);

  // useEffect(() => {
  //   const fetch_subregion = async () => {
  //     try {
  //       const response = await fetch(`${url_cantidad_eventos}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       if (!response.ok) throw new Error("Error al obtener subregiones.");
  //       const data = await response.json();

  //       console.log("data total", data);
  //       //console.log("data", data.result);
  //       //setDataMunicipios(data.result);
  //       setDataMunicipios(data.municipiosEventos.result);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching subregions:", error);
  //     }
  //   };

  //   fetch_subregion();
  // }, [token]);

  // if (loading) return <Spinner envio={"Cargando datos, por favor espera..."} />;
  // if (error) return <div>Error: {error}</div>;

  if (loading) return <Spinner envio={"Cargando datos desde el servidor..."} />;

  const bar_operador_data = {
    labels: operador_evento.map((item) => item.mes),
    datasets: [
      {
        label: "Cantidad",
        data: operador_evento.map((item) => item.cantidad),
        backgroundColor: "rgba(22, 111, 171, 0.5)",
        barPercentage: 0.7, // Controla el ancho relativo de cada barra (1 = ancho completo, 0.1 = muy delgado)
        categoryPercentage: 0.8, // Controla el espacio entre barras (1 = juntas, 0.1 = mucho espacio)
      },
    ],
  };

  const bar_operador_options = {
    responsive: true,
    indexAxis: "y", // <-- Esto hace que el gráfico sea horizontal
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Cantidad de Eventos Según Operador",
      },
    },
  };

  const usuario_object = JSON.parse(sessionStorage.getItem("usuario")) || {};

  const usuario = usuario_object.usuario;

  console.log("usuario_rol", usuario);

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.main}>
        <Sidebar usuario_dos={usuario_dos} super_usuario={super_usuario} />
        {/* <div className={styles.content}> */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // 3 columnas
            gap: "10px",
            justifyContent: "center",
            width: "100%",
            background: "#ecf0f1",
          }}
        >
          <div
            style={{
              width: "400px",
              marginLeft: "150px",
              marginTop: "20px",
            }}
          >
            <Card
              sx={{
                minWidth: 200,
                // height: 180,
                textAlign: "center",
                p: 2,
                border: "4px solid #216c95", // Borde azul
                boxShadow: 3, // Sombra suave
                borderRadius: 2, // Bordes redondeados
              }}
            >
              <CardContent>
                {/* <LocationCityIcon
                  sx={{ fontSize: 40, color: "#1976d2", mb: 1 }}
                />{" "} */}
                <img
                  src={imagen}
                  alt="Mapa de Nariño"
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "contain",
                    marginBottom: 8,
                  }}
                />
                {/* Ícono */}
                <Typography variant="h6" color="textSecondary">
                  {"Total de Municipios con Eventos"}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {20}
                </Typography>
              </CardContent>
            </Card>
          </div>

          <div
            style={{
              width: "400px",
              marginLeft: "100px",
              marginTop: "20px",
            }}
          >
            <Card
              sx={{
                minWidth: 200,
                height: 210,
                textAlign: "center",
                p: 2,
                border: "4px solid #216c95", // Borde azul
                boxShadow: 3, // Sombra suave
                borderRadius: 2, // Bordes redondeados
              }}
            >
              <CardContent>
                <LocationCityIcon
                  sx={{ fontSize: 40, color: "#1976d2", mb: 1 }}
                />{" "}
                {/* Ícono */}
                <Typography variant="h6" color="textSecondary">
                  {"Total de Operadores"}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {20}
                </Typography>
              </CardContent>
            </Card>
          </div>

          <div className={styles.bardouble}>
            {/* {data_municipios?.length > 0 && (
              <Bardouble municipios={data_municipios} />
            )} */}
            <Bardouble />
          </div>

          <div className={styles.dona_producto}>
            {/* <Pie data={pieData} options={pieOptions} /> */}
            <Dona />
          </div>

          <div className={styles.barra_poblacion}>
            <BarraPoblacion />
          </div>

          {/* <div className={styles.barra_operador}>
            <Bar data={bar_operador_data} options={bar_operador_options} />
          </div> */}

          <div className={styles.pastel_producto}>
            {/* <Pie data={pieData} options={pieOptions} /> */}
            <PieGraphic />
          </div>

          <div className={styles.linea_mes}>
            <LineaMes />
          </div>

          <div className={styles.dona_actividad}>
            {/* <Pie data={pieData} options={pieOptions} /> */}
            <DonaActividad />
            {/* <Doughnut data={doughnut_data} options={doughnut_options} /> */}
          </div>

          <div className={styles.radar_check}>
            <RadarCheck />
          </div>
          <div className={styles.radar_entorno}>
            {/* <PolarArea data={polar_data} options={polar_options} /> */}
            <RadarEntorno />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbo;

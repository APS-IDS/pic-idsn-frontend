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
import DonaActividad from "./DonaActividades";

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

const RadarEntorno = () => {
  const entorno_actividad = [
    {
      mes: "Hogar",
      cantidad: 10,
    },
    {
      mes: "Comunitario",
      cantidad: 12,
    },
    {
      mes: "Educativo",
      cantidad: 14,
    },
    {
      mes: "Laboral-Informal",
      cantidad: 14,
    },
    {
      mes: "Insitucional",
      cantidad: 14,
    },
  ];

  const colors_polar = [
    "#FF638480",
    "#36A2EB80",
    "#FFCE5680",
    "#4BC0C080",
    "#9966FF80",
  ];

  const polar_data = {
    labels: entorno_actividad.map((item) => item.mes), // Extrae los nombres
    datasets: [
      {
        data: entorno_actividad.map((item) => item.cantidad), // Extrae las cantidades
        backgroundColor: colors_polar,
        // hoverBackgroundColor: colors_polar.map((color) => color + "CC"), // Versión con transparencia
      },
    ],
  };

  const polar_options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Número de Actividades Según Entorno",
      },
    },
  };

  return (
    <>
      <PolarArea data={polar_data} options={polar_options} />
    </>
  );
};

export default RadarEntorno;

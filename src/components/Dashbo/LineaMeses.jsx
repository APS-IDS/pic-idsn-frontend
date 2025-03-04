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

const LineaMes = () => {
  const mes_actividad = [
    { mes: "Enero", cantidad: 10 },
    { mes: "Febrero", cantidad: 12 },
    { mes: "Marzo", cantidad: 14 },
    { mes: "Abril", cantidad: 16 },
    { mes: "Mayo", cantidad: 18 },
    { mes: "Junio", cantidad: 20 },
    { mes: "Julio", cantidad: 22 },
    { mes: "Agosto", cantidad: 24 },
    { mes: "Septiembre", cantidad: 26 },
    { mes: "Octubre", cantidad: 28 },
    { mes: "Noviembre", cantidad: 40 },
    { mes: "Diciembre", cantidad: 32 },
  ];

  const data_mes = {
    labels: mes_actividad.map((item) => item.mes),
    datasets: [
      {
        label: "Actividad por Mes",
        data: mes_actividad.map((item) => item.cantidad),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options_mes = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Cantidad de Actividades por Mes",
      },
    },
  };

  return (
    <>
      <Line data={data_mes} options={options_mes} />
    </>
  );
};

export default LineaMes;

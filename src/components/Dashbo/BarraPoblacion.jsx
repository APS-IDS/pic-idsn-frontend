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

const BarraPoblacion = () => {
  const poblacion_actividad = [
    {
      mes: "Familias",
      cantidad: 10,
    },
    {
      mes: "Comunidad",
      cantidad: 12,
    },
    {
      mes: "Personas",
      cantidad: 14,
    },
    {
      mes: "Estudiantes",
      cantidad: 14,
    },
    {
      mes: "Comunidad Educativa",
      cantidad: 14,
    },
    {
      mes: "Trabajadores",
      cantidad: 14,
    },
  ];

  const barData = {
    labels: poblacion_actividad.map((item) => item.mes),
    datasets: [
      {
        label: "Cantidad",
        data: poblacion_actividad.map((item) => item.cantidad),
        backgroundColor: "rgba(22, 111, 171, 0.5)",
        barPercentage: 0.7, // Controla el ancho relativo de cada barra (1 = ancho completo, 0.1 = muy delgado)
        categoryPercentage: 0.8, // Controla el espacio entre barras (1 = juntas, 0.1 = mucho espacio)
      },
    ],
  };

  const barOptions = {
    responsive: true,
    indexAxis: "y", // <-- Esto hace que el gráfico sea horizontal
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Cantidad de Actividades Segúng Población",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
  };
  return (
    <>
      <Bar data={barData} options={barOptions} />
    </>
  );
};

export default BarraPoblacion;

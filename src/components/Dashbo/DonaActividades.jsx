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

const DonaActividad = () => {
  const tecnologia_actividad = [
    {
      mes: "Redes Familiares",
      cantidad: 10,
    },
    {
      mes: "Zonas de Escucha",
      cantidad: 12,
    },
    {
      mes: "Rehabilitación",
      cantidad: 14,
    },
    {
      mes: "Tamizaje",
      cantidad: 8,
    },
    {
      mes: "Jornadas de Salud",
      cantidad: 7,
    },
    {
      mes: "Vacunación",
      cantidad: 5,
    },
    {
      mes: "Medicamentos",
      cantidad: 4,
    },
  ];

  const doughnut_data = {
    labels: tecnologia_actividad.map((item) => item.mes),
    datasets: [
      {
        data: tecnologia_actividad.map((item) => item.cantidad),
        // backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        // hoverBackgroundColor: ["#FF6384CC", "#36A2EBCC", "#FFCE56CC"],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8DCD55",
        ],
        hoverBackgroundColor: [
          "#FF6384CC",
          "#36A2EBCC",
          "#FFCE56CC",
          "#4BC0C0CC",
          "#9966FFCC",
          "#FF9F40CC",
          "#8DCD55CC",
        ],
      },
    ],
  };

  const doughnut_options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Cantidad de Actividades por Tecnología",
      },
    },
  };

  return (
    <>
      <div style={{ width: "450px", marginLeft: "20px" }}>
        <Doughnut data={doughnut_data} options={doughnut_options} />
      </div>
    </>
  );
};

export default DonaActividad;

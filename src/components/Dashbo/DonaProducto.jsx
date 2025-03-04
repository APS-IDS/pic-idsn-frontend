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

const Dona = () => {
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

  const doughnut_data = {
    labels: productos_proyecto.map((item) => item.mes),
    datasets: [
      {
        data: productos_proyecto.map((item) => item.cantidad),
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
        text: "Cantidad de Productos Según Proyecto",
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

export default Dona;

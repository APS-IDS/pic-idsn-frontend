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
import { Pie } from "react-chartjs-2";

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

const PieGraphic = () => {
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

  const pieData = {
    labels: productos_proyecto.map((item) => item.mes),
    datasets: [
      {
        data: productos_proyecto.map((item) => item.cantidad),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
        ],
        hoverBackgroundColor: [
          "#FF6384CC",
          "#36A2EBCC",
          "#FFCE56CC",
          "#4BC0C0CC",
          "#9966FFCC",
          "#FF9F40CC",
          "#C9CBCFCC",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        align: "start", // Alinea los elementos del legend a la izquierda
      },
      title: {
        display: true,
        text: "Cantidad de Productos Según Proyecto",
        font: {
          size: 15, // Ajusta el tamaño del texto
          weight: "bold", // Opcional: hace el texto más grueso
        },
        padding: {
          top: 10,
          bottom: 8, // Espacio debajo del título
        },
      },
    },
  };

  return (
    <>
      <Pie data={pieData} options={pieOptions} />
    </>
  );
};

export default PieGraphic;

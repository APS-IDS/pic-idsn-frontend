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
  const producto_indicador = [
    {
      mes: "Menos de 2 indicadores",
      cantidad: 10,
    },
    {
      mes: "Igual a 2 y menor o igual a 3 indicadores",
      cantidad: 20,
    },
    {
      mes: "Mas de tres indicadores",
      cantidad: 30,
    },
  ];

  const pieData = {
    labels: producto_indicador.map((item) => item.mes),
    datasets: [
      {
        data: producto_indicador.map((item) => item.cantidad),
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
        labels: {
          boxWidth: 40,
          padding: 10,
          textAlign: "left",
          font: {
            size: 16, // Tamaño de los labels (leyenda)
          },
        },
      },
      title: {
        display: true,
        text: "Cantidad de Productos por Indicador",
        font: {
          size: 18, // Ajusta el tamaño del texto
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

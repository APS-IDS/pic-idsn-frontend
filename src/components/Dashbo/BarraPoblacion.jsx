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
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

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
  const data_full = useSelector((state) => state.data || []);

  const [data_poblacion, setDataPoblacion] = useState([]);

  // useEffect(() => {
  //   if (data_full?.actividadesPoblacion?.result) {
  //     setDataPoblacion(data_full.actividadesPoblacion.result);
  //   }
  // }, [data_full]);

  useEffect(() => {
    if (data_full?.actividadesPoblacion?.result) {
      const resultObj = data_full.actividadesPoblacion.result;
      const resultArray = Object.entries(resultObj).map(
        ([poblacion, cantidad]) => ({
          poblacion,
          cantidad,
        })
      );
      setDataPoblacion(resultArray);
    }
  }, [data_full]);

  const barData = {
    labels: data_poblacion.map((item) => item.poblacion),
    datasets: [
      {
        label: "Cantidad",
        data: data_poblacion.map((item) => item.cantidad),
        backgroundColor: "rgba(22, 111, 171, 0.5)",
        barPercentage: 0.7, // Controla el ancho relativo de cada barra (1 = ancho completo, 0.1 = muy delgado)
        categoryPercentage: 0.8, // Controla el espacio entre barras (1 = juntas, 0.1 = mucho espacio)
      },
    ],
  };

  // const barOptions = {
  //   responsive: true,
  //   indexAxis: "y", // <-- Esto hace que el gráfico sea horizontal
  //   plugins: {
  //     legend: { position: "top" },
  //     title: {
  //       display: true,
  //       text: "Cantidad de Actividades Según Población",
  //       font: {
  //         size: 18,
  //         weight: "bold",
  //       },
  //     },
  //   },
  // };

  const barOptions = {
    responsive: true,

    indexAxis: "y", // gráfico horizontal
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 16, // Tamaño del texto de la leyenda
          },
        },
      },
      title: {
        display: true,
        text: "Cantidad de Actividades Según Población",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 15, // Cambia este valor para agrandar los números del eje X
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 15, // Cambia este valor para agrandar los textos del eje Y
          },
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

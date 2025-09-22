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

const LineaMes = () => {
  const data_full = useSelector((state) => state.data || []);
  const [data_mes_actividad, setDataMes] = useState([]);

  useEffect(() => {
    if (data_full?.actividadesMes?.result) {
      const resultObj = data_full.actividadesMes.result;
      const resultArray = Object.entries(resultObj).map(([mes, cantidad]) => ({
        mes,
        cantidad,
      }));
      setDataMes(resultArray);
    }
  }, [data_full]);

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
    labels: data_mes_actividad.map((item) => item.mes),
    datasets: [
      {
        label: "Actividad por Mes",
        data: data_mes_actividad.map((item) => item.cantidad),
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
        labels: {
          font: {
            size: 15, // Tamaño del texto de la leyenda
          },
        },
      },
      title: {
        display: true,
        text: "Cantidad de Actividades por Mes",
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
      <Line data={data_mes} options={options_mes} />
    </>
  );
};

export default LineaMes;

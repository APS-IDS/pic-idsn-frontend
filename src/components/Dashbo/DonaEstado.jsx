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

const DonaEstado = () => {
  const data_full = useSelector((state) => state.data || []);
  const [data_actividad, setDataActividad] = useState([]);

  useEffect(() => {
    if (data_full?.actividadesTecnologia?.result) {
      const resultObj = data_full.actividadesPorEstado.result;
      const resultArray = Object.entries(resultObj).map(
        ([actividad, cantidad]) => ({
          actividad,
          cantidad,
        })
      );
      setDataActividad(resultArray);
    }
  }, [data_full]);

  const doughnut_data = {
    labels: data_actividad.map((item) => item.actividad),
    datasets: [
      {
        data: data_actividad.map((item) => item.cantidad),

        backgroundColor: [
          "#1a8a12ff",
          "#0ab76fff",
          "#0d90c7ff",
          "#4BC0C0",
          "#9966FF",
          "#8DCD55",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#1da713ff",
          "#11cf80ff",
          "#33a2d2ff",
          "#4BC0C0CC",
          "#9966FFCC",
          "#8DCD55CC",
          "#FF9F40CC",
        ],
      },
    ],
  };

  const doughnut_options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
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
        text: "Cantidad de Actividades por Estado",
        font: {
          size: 18, // Tamaño del título
          weight: "bold", // Puedes usar normal, bold, etc.
        },
      },

      tooltip: {
        boxPadding: 10,
        callbacks: {
          title: () => "",

          label: function (context) {
            const value = context.raw;
            let label = context.label || "";
            if (label.length > 25) {
              label = label.slice(0, 25) + "...";
            }

            return `${label}: ${value}`;
          },
        },
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
      },
    },
  };

  return (
    <>
      <Doughnut data={doughnut_data} options={doughnut_options} />
    </>
  );
};

export default DonaEstado;

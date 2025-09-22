import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  const [data_productos, setDataProductos] = useState([]);

  const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  const token = token_object.token;

  const back = import.meta.env.VITE_APP_BACK;
  const url_cantidad_productos = `${back}/api/productos-proyecto`;

  const data_full = useSelector((state) => state.data || []);

  useEffect(() => {
    if (data_full?.productosProyecto?.result) {
      setDataProductos(data_full.productosProyecto.result);
    }
  }, [data_full]);

  const doughnut_data = {
    // labels: data_productos.map((item) => item.proyecto),
    labels: data_productos.map((item) =>
      item.proyecto.length > 45
        ? item.proyecto.slice(0, 45) + "..."
        : item.proyecto
    ),
    datasets: [
      {
        data: data_productos.map((item) => item.productos),
        backgroundColor: [
          // "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8DCD55",
        ],
        hoverBackgroundColor: [
          // "#FF6384CC",
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
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          boxWidth: 40,
          padding: 10,
          textAlign: "left",
          font: {
            size: 15, // Tamaño de los labels (leyenda)
          },
        },
      },
      title: {
        display: true,
        text: "Cantidad de Productos Según Proyecto",
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

export default Dona;

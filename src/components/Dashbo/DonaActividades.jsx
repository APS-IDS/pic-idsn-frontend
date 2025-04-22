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

const DonaActividad = () => {
  const data_full = useSelector((state) => state.data || []);
  const [data_actividad, setDataActividad] = useState([]);

  useEffect(() => {
    if (data_full?.actividadesTecnologia?.result) {
      const resultObj = data_full.actividadesTecnologia.result;
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

  // const doughnut_options = {
  //   responsive: true,
  //   plugins: {
  //     legend: { position: "bottom" },
  //     title: {
  //       display: true,
  //       text: "Cantidad de Actividades por Tecnología",
  //     },
  //   },
  // };

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
        text: "Cantidad de Actividades por Tecnología",
        font: {
          size: 18, // Tamaño del título
          weight: "bold", // Puedes usar normal, bold, etc.
        },
      },

      tooltip: {
        boxPadding: 10,
        callbacks: {
          title: () => "",
          // label: function (context) {
          //   const value = context.raw;
          //   const data = context.chart.data.datasets[0].data;
          //   const total = data.reduce((sum, val) => sum + val, 0);
          //   const percentage = ((value / total) * 100).toFixed(1); // 1 decimal

          //   return `Productos: ${value} (${percentage}%)`;
          // },
          label: function (context) {
            const value = context.raw;
            let label = context.label || "";
            if (label.length > 25) {
              label = label.slice(0, 25) + "...";
            }

            return `${label}: ${value}`;
            // return `Productos: ${value}`;
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
      {/* <div style={{ width: "500px", marginLeft: "20px" }}>
        <Doughnut data={doughnut_data} options={doughnut_options} />
      </div> */}

      <Doughnut data={doughnut_data} options={doughnut_options} />
    </>
  );
};

export default DonaActividad;

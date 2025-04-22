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
import DonaActividad from "./DonaActividades";
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

const RadarCheck = () => {
  const data_full = useSelector((state) => state.data || []);
  const [data_check, setDataCheck] = useState([]);

  useEffect(() => {
    if (data_full?.soportesEstado?.result) {
      const resultObj = data_full.soportesEstado.result;
      const resultArray = Object.entries(resultObj).map(
        ([check, cantidad]) => ({
          check,
          cantidad,
        })
      );
      setDataCheck(resultArray);
    }
  }, [data_full]);

  const check_soporte = [
    {
      mes: "Aprobado",
      cantidad: 10,
    },
    {
      mes: "No aprobado",
      cantidad: 12,
    },
    {
      mes: "Aprobado Soporte Físico",
      cantidad: 14,
    },
    {
      mes: "No Aprobado Soporte Físico",
      cantidad: 14,
    },
  ];

  const colors_polar = [
    "#FF638480",
    "#36A2EB80",
    "#FFCE5680",
    "#4BC0C080",
    "#9966FF80",
  ];

  const polar_data = {
    labels: data_check.map((item) => item.check), // Extrae los nombres
    datasets: [
      {
        data: data_check.map((item) => item.cantidad), // Extrae las cantidades
        backgroundColor: colors_polar,
        // hoverBackgroundColor: colors_polar.map((color) => color + "CC"), // Versión con transparencia
      },
    ],
  };

  const polar_options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 40,
          padding: 10,
          textAlign: "left",
          font: {
            size: 14, // Tamaño de los labels (leyenda)
          },
        },
      },
      title: {
        display: true,
        text: "Cantidad de Soportes Según Check",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
  };

  return (
    <>
      <PolarArea data={polar_data} options={polar_options} />
    </>
  );
};

export default RadarCheck;

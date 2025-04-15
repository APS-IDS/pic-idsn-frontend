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

const RadarEntorno = () => {
  const data_full = useSelector((state) => state.data || []);
  const [data_entorno, setDataEntorno] = useState([]);

  useEffect(() => {
    if (data_full?.actividadesEntorno?.result) {
      const resultObj = data_full.actividadesEntorno.result;
      const resultArray = Object.entries(resultObj).map(
        ([entorno, cantidad]) => ({
          entorno,
          cantidad,
        })
      );
      setDataEntorno(resultArray);
    }
  }, [data_full]);

  const entorno_actividad = [
    {
      mes: "Hogar",
      cantidad: 10,
    },
    {
      mes: "Comunitario",
      cantidad: 12,
    },
    {
      mes: "Educativo",
      cantidad: 14,
    },
    {
      mes: "Laboral-Informal",
      cantidad: 14,
    },
    {
      mes: "Insitucional",
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
    labels: data_entorno.map((item) => item.entorno), // Extrae los nombres
    datasets: [
      {
        data: data_entorno.map((item) => item.cantidad), // Extrae las cantidades
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
      },
      title: {
        display: true,
        text: "Número de Actividades Según Entorno",
      },
    },
  };

  return (
    <>
      <div style={{ width: "450px", marginLeft: "20px" }}>
        <PolarArea data={polar_data} options={polar_options} />
      </div>
    </>
  );
};

export default RadarEntorno;

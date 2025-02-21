import React, { useState } from "react";
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
import { Bar } from "react-chartjs-2";

const Bardouble = () => {
  const [activeDataset, setActiveDataset] = useState("eventos");

  const eventos_municipio = [
    { mes: "LA UNION", cantidad: 10 },
    { mes: "BUESACO", cantidad: 20 },
    { mes: "EL TABLON", cantidad: 15 },
    { mes: "BELEN", cantidad: 30 },
    { mes: "SAN BERNARDO", cantidad: 25 },
    { mes: "TANGUA", cantidad: 35 },
    { mes: "YACUANQUER", cantidad: 40 },
  ];

  const tecnologia_actividad = [
    {
      mes: "Redes Familiares",
      cantidad: 10,
    },
    {
      mes: "Zonas de Escucha",
      cantidad: 12,
    },
    {
      mes: "Rehabilitación",
      cantidad: 14,
    },
    {
      mes: "Tamizaje",
      cantidad: 8,
    },
    {
      mes: "Jornadas de Salud",
      cantidad: 7,
    },
    {
      mes: "Vacunación",
      cantidad: 5,
    },
    {
      mes: "Medicamentos",
      cantidad: 4,
    },
  ];

  const labels_doble =
    activeDataset === "eventos"
      ? eventos_municipio.map((item) => item.mes)
      : tecnologia_actividad.map((item) => item.mes);

  const data_doble_barra = {
    // labels: eventos_municipio.map((item) => item.mes),
    labels: labels_doble,
    datasets: [
      {
        label: "Cantidad de Eventos",
        data: eventos_municipio.map((item) => item.cantidad),
        backgroundColor: "rgba(40, 20, 153, 0.5)",
        hidden: activeDataset !== "eventos", // Oculta si no está activo
        barPercentage: 0.9, // Controla el ancho relativo de cada barra (1 = ancho completo, 0.1 = muy delgado)
        categoryPercentage: 0.8, // Controla el espacio entre barras (1 = juntas, 0.1 = mucho espacio)
      },
      {
        label: "Cantidad de Actividades",
        data: tecnologia_actividad.map((item) => item.cantidad),
        backgroundColor: "rgba(20, 140, 130, 0.5)",
        hidden: activeDataset !== "tecnologia", // Oculta si no está activo
      },
    ],
  };

  const doble_barra_options = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12, // Tamaño de fuente de los labels de la leyenda
            weight: "bold", // Opcional, para negrita
          },
        },
        onClick: (e, legendItem, legend) => {
          const datasetIndex = legendItem.datasetIndex;
          setActiveDataset(datasetIndex === 0 ? "eventos" : "tecnologia");
        },
      },
      title: {
        display: true,
        text:
          activeDataset === "eventos"
            ? "Cantidad de Eventos por Municipio"
            : "Cantidad de Actividades Según Tecnologías",
        font: {
          size: 18, // Tamaño de fuente del título
          weight: "bold", // Opcional, para negrita
        },
      },
    },
    scales: {
      y: {
        ticks: {
          font: {
            size: 13, // Tamaño de fuente en eje Y
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 13, // Tamaño de fuente en eje X
          },
        },
      },
    },
  };

  return (
    <>
      <Bar data={data_doble_barra} options={doble_barra_options} />
    </>
  );
};

export default Bardouble;

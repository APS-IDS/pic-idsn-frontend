import React, { useState, useEffect } from "react";
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

  const [data_municipios, setDataMunicipios] = useState([]);

  const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  const token = token_object.token;

  const back = import.meta.env.VITE_APP_BACK;
  const url_cantidad_eventos = `${back}/api/municipios-eventos`;

  useEffect(() => {
    const fetch_subregion = async () => {
      try {
        const response = await fetch(`${url_cantidad_eventos}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener subregiones.");
        const data = await response.json();
        //setSubregions(data.data);
        //setMunicipios(data.data);
        console.log("data", data.result);
        setDataMunicipios(data.result);
      } catch (error) {
        console.error("Error fetching subregions:", error);
      }
    };

    fetch_subregion();
  }, [token]);

  console.log("data_municipios", data_municipios);

  const eventos_municipio = [
    { mes: "LA UNION", cantidad: 10 },
    { mes: "BUESACO", cantidad: 20 },
    { mes: "EL TABLON", cantidad: 15 },
    { mes: "BELEN", cantidad: 30 },
    { mes: "SAN BERNARDO", cantidad: 25 },
    { mes: "TANGUA", cantidad: 35 },
    { mes: "YACUANQUER", cantidad: 40 },
  ];

  const operador_evento = [
    {
      mes: "E.S.E. Hospital San Andrés - Tumaco",
      cantidad: 10,
    },
    {
      mes: "E.S.E. Hospital el Buen Samaritano - La Cruz",
      cantidad: 20,
    },
    {
      mes: "E.S.E. Hospital Departamental de Nariño",
      cantidad: 15,
    },
    {
      mes: "E.S.E. Centro de Salud de Puerres",
      cantidad: 30,
    },
    { mes: "E.S.E. Hospital Clarita Santos - Sandoná", cantidad: 25 },
    { mes: "E.S.E. Centro de Salud de Ancuyá - Nariñoz", cantidad: 35 },
    { mes: "E.S.E. Centro de Salud - Consacá", cantidad: 40 },
  ];

  const labels_doble =
    activeDataset === "eventos"
      ? // ? eventos_municipio.map((item) => item.mes)
        data_municipios.map((item) => item.municipio)
      : operador_evento.map((item) => item.mes);

  const data_doble_barra = {
    // labels: eventos_municipio.map((item) => item.mes),
    labels: labels_doble,
    datasets: [
      {
        label: "Cantidad de Eventos",
        // data: eventos_municipio.map((item) => item.cantidad),
        data: data_municipios.map((item) => item.eventos),
        backgroundColor: "rgba(40, 20, 153, 0.5)",
        hidden: activeDataset !== "eventos", // Oculta si no está activo
        barPercentage: 0.9, // Controla el ancho relativo de cada barra (1 = ancho completo, 0.1 = muy delgado)
        categoryPercentage: 0.8, // Controla el espacio entre barras (1 = juntas, 0.1 = mucho espacio)
      },
      {
        label: "Cantidad de Eventos Operador",
        data: operador_evento.map((item) => item.cantidad),
        backgroundColor: "rgba(20, 140, 130, 0.5)",
        hidden: activeDataset !== "operador", // Oculta si no está activo
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
          setActiveDataset(datasetIndex === 0 ? "eventos" : "operador");
        },
      },
      title: {
        display: true,
        text:
          activeDataset === "eventos"
            ? "Cantidad de Eventos por Municipio"
            : "Cantidad de Eventos Según Operador",
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

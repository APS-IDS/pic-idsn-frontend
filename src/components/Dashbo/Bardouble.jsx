import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Bar } from "react-chartjs-2";

const Bardouble = () => {
  const [data_municipios, setDataMunicipios] = useState([]);

  const [data_operador, setDataOperador] = useState([]);

  const [activeDataset, setActiveDataset] = useState("eventos");

  const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  const token = token_object.token;

  const data_full = useSelector((state) => state.data || []);

  useEffect(() => {
    if (
      data_full?.municipiosEventos?.result &&
      data_full?.eventosOperador?.result
    ) {
      setDataMunicipios(data_full.municipiosEventos.result);
      setDataOperador(data_full.eventosOperador.result);
    }
  }, [data_full]);

  const back = import.meta.env.VITE_APP_BACK;

  const url_cantidad_eventos = `${back}/api/dashboard-all`;

  const labels_doble =
    activeDataset === "eventos"
      ? // ? eventos_municipio.map((item) => item.mes)
        data_municipios.map((item) => item.municipio)
      : // data.map((item) => item.municipio)
        //data.map((item) => item.municipio)
        data_operador.map((item) => item.operador);

  const data_doble_barra = {
    labels: labels_doble,
    datasets: [
      {
        label: "Cantidad de Eventos",

        data: data_municipios.map((item) => item.eventos),
        backgroundColor: "rgba(40, 20, 153, 0.5)",
        hidden: activeDataset !== "eventos", // Oculta si no está activo
        barPercentage: 0.9, // Controla el ancho relativo de cada barra (1 = ancho completo, 0.1 = muy delgado)
        categoryPercentage: 0.8, // Controla el espacio entre barras (1 = juntas, 0.1 = mucho espacio)
      },
      {
        label: "Cantidad de Eventos Operador",
        data: data_operador.map((item) => item.eventos),
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
            size: 12,
            weight: "bold",
          },
          padding: 20, // Aumenta este valor para más separación
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
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            const label = this.getLabelForValue(value);
            const maxLength = 25;
            return label.length > maxLength
              ? label.slice(0, maxLength) + "..."
              : label;
          },
          font: {
            size: 13,
          },
          padding: 5,
        },
      },
      x: {
        ticks: {
          font: {
            size: 13,
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

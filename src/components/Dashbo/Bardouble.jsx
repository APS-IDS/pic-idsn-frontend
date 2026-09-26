import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";


const gridColor = '#e7ebee';
const baseBarOpts = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top', align: 'start', labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true } } },
  scales: {
    x: { beginAtZero: true, grid: { color: gridColor }, ticks: { precision: 0 } },
    y: { grid: { display: false } }
  }
};

const Bardouble = ({ title, data }) => {


  return (
    <div className="bg-app-card border border-app-border rounded-lg overflow-hidden shadow-md flex flex-col">
      <div className="p-3 border-b border-app-border">
        <h3 className="font-semibold text-navy">{title}</h3>
      </div>
      <div className="p-4 h-[350px] relative">
        {(data && data.labels && data.labels.length > 0 ? (
          <Bar data={data} options={baseBarOpts} />
        ) : (
          <p className="flex h-full justify-center text-center text-sm text-gray-500 items-center">No hay datos para mostrar</p>
        ))}
      </div>
    </div>

  );
};

export default Bardouble;

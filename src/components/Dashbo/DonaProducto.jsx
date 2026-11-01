import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const baseDonaOpts = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '55%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true, padding: 22, },
    },
    datalabels: {
      formatter: (value, ctx) => {
        const datapoints = ctx.chart.data.datasets[0].data;
        const total = datapoints.reduce((total, datapoint) => total + datapoint, 0);
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        return `${percentage}%`;
      },
      color: '#fff', // Color del texto dentro de la dona
      font: {
        size: 12,
      }
    }
  }
};

const Dona = ({ title, data }) => {

  return (
    <div className="bg-app-card border border-app-border rounded-lg overflow-hidden shadow-md flex flex-col">
      <div className="p-3 border-b border-app-border">
        <h3 className="font-semibold text-navy">{title}</h3>
      </div>
      <div className="p-4 h-[350px] relative">
        {(data && data.labels && data.labels.length > 0 ? (
          <Doughnut data={data} options={baseDonaOpts} />
        ) : (
          <p className="flex h-full justify-center text-center text-sm text-gray-500 items-center">No hay datos para mostrar</p>
        ))}
      </div>
    </div>
  );
};

export default Dona;
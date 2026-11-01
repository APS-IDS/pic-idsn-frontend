import { Line } from 'react-chartjs-2';

const LineaMes = ({ title, data }) => {
  const optionsMes = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0, // 0 para líneas totalmente rectas (sin curvas)
      },
      point: {
        radius: 5, // Tamaño del punto/punteado
        hoverRadius: 7, // Tamaño al pasar el cursor
        borderWidth: 2,
        backgroundColor: '#1E293B',
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        padding: 10,
        backgroundColor: '#1E293B',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: '500',
          },
          color: '#64748B',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#F1F5F9',
        },
        ticks: {
          precision: 0,
          font: {
            size: 13,
          },
          color: '#64748B',
        },
      },
    },
  };

  return (
    <div className="bg-app-card border border-app-border rounded-lg overflow-hidden shadow-md flex flex-col col-span-2">
      <div className="p-3 border-b border-app-border">
        <h3 className="font-semibold text-navy">{title}</h3>
      </div>
      <div className="p-4 h-[350px] relative">
        <Line data={data} options={optionsMes} />
      </div>
    </div>
  );
};

export default LineaMes;
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data, labels, colors, height = 180 }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#0f172a',
          font: { size: 13, family: 'inherit' },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  return (
    <div style={{ width: '100%', height }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}

import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MoodChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood',
        data: data.map(d => d.mood),
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Mood Trend</h3>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
};

const HealthMetricsChart = ({ data }) => {
  if (!data) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  const chartData = {
    labels: ['Sleep', 'Exercise', 'Stress', 'Anxiety', 'Productivity'],
    datasets: [
      {
        label: 'Health Metrics',
        data: [
          data.averageSleep,
          Math.min(data.totalExercise / 60, 10),
          10 - data.averageStress,
          10 - data.averageAnxiety,
          data.averageMood,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Health Metrics</h3>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export { MoodChart, HealthMetricsChart };

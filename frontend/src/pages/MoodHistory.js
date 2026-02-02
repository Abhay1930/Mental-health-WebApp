import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Line } from 'react-chartjs-2';
import 'react-calendar-heatmap/dist/styles.css';
import { analyticsService } from '../services/apiService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 }
];

const MoodHistory = () => {
  const [range, setRange] = useState({ days: 30 });
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const loadData = async () => {
    try {
      const params = {};
      if (range.days) params.days = range.days;
      if (start && end) { params.start = start; params.end = end; }
      const [histRes, sumRes] = await Promise.all([
        analyticsService.getMoodHistory(params),
        analyticsService.getSummary(params)
      ]);
      if (histRes.data.success) setHistory(histRes.data.history);
      if (sumRes.data.success) setSummary(sumRes.data.summary);
    } catch (err) {
      console.error('Failed to load mood history', err);
    }
  };

  const heatmapValues = history.map(h => ({ date: h.date, count: Math.round(h.avgMood) }));

  const lineData = (key) => ({
    labels: history.map(h => h.date),
    datasets: [{
      label: key,
      data: history.map(h => Number(h[key] || 0)),
      borderColor: 'rgba(99,102,241,0.8)',
      backgroundColor: 'rgba(99,102,241,0.4)'
    }]
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Mood History & Analytics</h1>

        <div className="flex gap-2 mb-4">
          {presets.map(p => (
            <button key={p.label} onClick={() => setRange({ days: p.days })} className="px-3 py-1 bg-white border rounded">{p.label}</button>
          ))}
          <div className="flex items-center gap-2">
            <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="border p-1" />
            <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="border p-1" />
            <button onClick={()=>{ setRange({}); loadData(); }} className="px-3 py-1 bg-white border rounded">Apply</button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Calendar Heatmap</h2>
          <CalendarHeatmap
            startDate={history.length ? history[0].date : new Date()}
            endDate={history.length ? history[history.length-1].date : new Date()}
            values={heatmapValues}
            classForValue={value => {
              if (!value) return 'color-empty';
              const v = value.count;
              if (v >= 8) return 'color-github-4';
              if (v >= 6) return 'color-github-3';
              if (v >= 4) return 'color-github-2';
              return 'color-github-1';
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Mood (line)</h3>
            <Line data={lineData('avgMood')} />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Sleep (line)</h3>
            <Line data={lineData('avgSleep')} />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Stress (line)</h3>
            <Line data={lineData('avgStress')} />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Anxiety (line)</h3>
            <Line data={lineData('avgAnxiety')} />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p>Average Mood: {summary ? Number(summary.avgMood).toFixed(2) : '-'}</p>
          <p>Average Sleep: {summary ? Number(summary.avgSleep).toFixed(2) : '-'}</p>
          <p>Average Stress: {summary ? Number(summary.avgStress).toFixed(2) : '-'}</p>
          <p>Average Anxiety: {summary ? Number(summary.avgAnxiety).toFixed(2) : '-'}</p>
          <p>Best Day: {summary?.bestDay ? `${summary.bestDay.date} (avg ${Number(summary.bestDay.avgMood).toFixed(2)})` : '-'}</p>
          <p>Worst Day: {summary?.worstDay ? `${summary.worstDay.date} (avg ${Number(summary.worstDay.avgMood).toFixed(2)})` : '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default MoodHistory;

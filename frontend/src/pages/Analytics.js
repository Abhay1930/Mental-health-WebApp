import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { wellnessService } from '../services/apiService';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import { MoodChart, HealthMetricsChart } from '../components/Charts';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      loadData();
    }
  }, [days, navigate]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [summaryRes, historyRes] = await Promise.all([
        wellnessService.getSummary(days),
        wellnessService.getHistory(days)
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.summary);
      if (historyRes.data.success) setHistory(historyRes.data.entries);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-600">Analytics</h1>
          <div className="flex gap-4 items-center">
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Average Mood</p>
            <p className="text-3xl font-bold text-purple-600">
              {summary?.averageMood.toFixed(1)}/10
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Avg Sleep</p>
            <p className="text-3xl font-bold text-blue-600">
              {summary?.averageSleep.toFixed(1)}h
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Exercise</p>
            <p className="text-3xl font-bold text-green-600">
              {summary?.totalExercise.toFixed(0)}m
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Avg Stress</p>
            <p className="text-3xl font-bold text-red-600">
              {summary?.averageStress.toFixed(1)}/10
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Avg Anxiety</p>
            <p className="text-3xl font-bold text-orange-600">
              {summary?.averageAnxiety.toFixed(1)}/10
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MoodChart data={summary?.moodTrend} />
          <HealthMetricsChart data={summary} />
        </div>

        {/* Recent Entries */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Recent Entries</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Mood</th>
                  <th className="p-3 text-left">Sleep</th>
                  <th className="p-3 text-left">Exercise</th>
                  <th className="p-3 text-left">Stress</th>
                  <th className="p-3 text-left">Prediction</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{entry.mood_today}/10</td>
                    <td className="p-3">{entry.sleep_hours}h</td>
                    <td className="p-3">{entry.exercise_minutes}m</td>
                    <td className="p-3">{entry.stress_level}/10</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.predicted_mood === 'happy' ? 'bg-yellow-100 text-yellow-800' :
                        entry.predicted_mood === 'stressed' ? 'bg-red-100 text-red-800' :
                        entry.predicted_mood === 'sad' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {entry.predicted_mood}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { wellnessService } from '../services/apiService';
import { FiLogOut } from 'react-icons/fi';

const WellnessForm = () => {
  const [formData, setFormData] = useState({
    mood_today: 5,
    sleep_hours: 7,
    sleep_quality: 3,
    exercise_minutes: 30,
    stress_level: 5,
    screen_time: 6,
    social_interaction_minutes: 60,
    water_intake_liters: 2,
    productivity_level: 5,
    anxiety_level: 5,
    notes: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await wellnessService.addEntry(formData);

      if (response.data.success) {
        setPrediction(response.data.prediction);
        setStreak(response.data.streak);
        setSuccess('Wellness entry saved successfully! 🎉');
        
        // Reset form
        setFormData({
          mood_today: 5,
          sleep_hours: 7,
          sleep_quality: 3,
          exercise_minutes: 30,
          stress_level: 5,
          screen_time: 6,
          social_interaction_minutes: 60,
          water_intake_liters: 2,
          productivity_level: 5,
          anxiety_level: 5,
          notes: '',
        });

        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600">MindTrack</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            <FiLogOut /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Daily Wellness Check</h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Mood Today */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mood Today (1-10): {formData.mood_today}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      name="mood_today"
                      value={formData.mood_today}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  {/* Sleep Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sleep Hours: {formData.sleep_hours}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="0.5"
                      name="sleep_hours"
                      value={formData.sleep_hours}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  {/* Sleep Quality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sleep Quality (1-5): {formData.sleep_quality}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      name="sleep_quality"
                      value={formData.sleep_quality}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  {/* Exercise Minutes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exercise Minutes: {formData.exercise_minutes}
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="exercise_minutes"
                      value={formData.exercise_minutes}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Stress Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stress Level (1-10): {formData.stress_level}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      name="stress_level"
                      value={formData.stress_level}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  {/* Screen Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Screen Time (hours): {formData.screen_time}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="0.5"
                      name="screen_time"
                      value={formData.screen_time}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  {/* Social Interaction */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Minutes: {formData.social_interaction_minutes}
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="social_interaction_minutes"
                      value={formData.social_interaction_minutes}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Water Intake */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Water (liters): {formData.water_intake_liters}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      name="water_intake_liters"
                      value={formData.water_intake_liters}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Productivity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Productivity (1-10): {formData.productivity_level}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      name="productivity_level"
                      value={formData.productivity_level}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  {/* Anxiety */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anxiety Level (1-10): {formData.anxiety_level}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      name="anxiety_level"
                      value={formData.anxiety_level}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Any additional notes about your day..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Wellness Entry'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Prediction Card */}
            {prediction && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Tomorrow's Prediction</h3>
                <div className={`text-4xl font-bold text-center p-4 rounded-lg ${
                  prediction === 'happy' ? 'bg-yellow-100 text-yellow-600' :
                  prediction === 'stressed' ? 'bg-red-100 text-red-600' :
                  prediction === 'sad' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {prediction.toUpperCase()}
                </div>
              </div>
            )}

            {/* Streak Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Streak 🔥</h3>
              <div className="text-4xl font-bold text-center text-orange-600 p-4 bg-orange-100 rounded-lg">
                {streak} days
              </div>
              <p className="text-center text-gray-600 mt-2 text-sm">Keep it up!</p>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">💡 Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Aim for 7-9 hours of sleep</li>
                <li>✓ Exercise 30+ mins daily</li>
                <li>✓ Limit screen time to 6 hours</li>
                <li>✓ Drink 2-3 liters of water</li>
                <li>✓ Manage stress with meditation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessForm;

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  register: (username, email, password, fullName) =>
    api.post('/auth/register', { username, email, password, fullName }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getProfile: () => api.get('/auth/profile'),
};

// Wellness services
export const wellnessService = {
  addEntry: (data) => api.post('/wellness', data),
  
  getHistory: (days = 30) =>
    api.get('/wellness/history', { params: { days } }),
  
  getSummary: (days = 7) =>
    api.get('/wellness/summary', { params: { days } }),
};

// Chat services
export const chatService = {
  sendMessage: (message) =>
    api.post('/chat', { message }),
  
  getChatHistory: () => api.get('/chat/history'),
  
  clearHistory: () => api.delete('/chat/history'),
};

export default api;

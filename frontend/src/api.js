// frontend/src/api.js - Add debugging
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API_URL:', API_URL); // Debug log

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add debugging to requests
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.url);
  console.log('Full URL:', config.baseURL + config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add debugging to responses
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.data);
    return response;
  },
  (error) => {
    console.log('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const register = (userData) => api.post('/register', userData);
export const login = (userData) => api.post('/login', userData);
export const getMe = () => api.get('/me');
export const getProtectedData = () => api.get('/protected');

export default api;
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email, password) {
    const loginData = { email, password };
    return api.post('/auth/login', loginData);
  },

  async signup(name, email, password, role) {
    const signupData = { name, email, password, role };
    return api.post('/auth/signup', signupData);
  },

  async logout() {
    return api.post('/auth/logout');
  },

  async verifyToken() {
    return api.get('/auth/verify');
  },

  async refreshToken() {
    return api.post('/auth/refresh');
  },

  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, newPassword) {
    return api.post('/auth/reset-password', { token, password: newPassword });
  },
};

export default api;
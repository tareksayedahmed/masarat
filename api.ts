import axios from 'axios';

// The full base URL for the backend is specified for local development. This
// ensures the frontend (e.g., on port 3000) can find the backend (on port 5000).
// For production, this would be a relative path or an environment variable.
const API_BASE_URL = 'http://localhost:5000'; 

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
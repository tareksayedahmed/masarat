import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: async (credentials: any) => {
    const res = await api.post('/api/auth/login', credentials);
    return res.data;
  },
  register: async (userData: any) => {
    const res = await api.post('/api/auth/register', userData);
    return res.data;
  },
  me: async () => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },
};

export const branchesAPI = {
  getAll: async () => {
    const res = await api.get('/api/branches');
    return res.data;
  },
};

export const carModelsAPI = {
  getAll: async () => {
    const res = await api.get('/api/car-models');
    return res.data;
  },
  update: async (id: string, modelData: any) => {
    const res = await api.put(`/api/car-models/${id}`, modelData);
    return res.data;
  },
};

export const carsAPI = {
  getAll: async () => {
    const res = await api.get('/api/cars');
    return res.data;
  },
  create: async (carData: any) => {
    const res = await api.post('/api/cars', carData);
    return res.data;
  },
  update: async (id: string, carData: any) => {
    const res = await api.put(`/api/cars/${id}`, carData);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/api/cars/${id}`);
    return res.data;
  },
};

export const bookingsAPI = {
  getAll: async () => {
    const res = await api.get('/api/bookings');
    return res.data;
  },
  create: async (bookingData: any) => {
    const res = await api.post('/api/bookings', bookingData);
    return res.data;
  },
  update: async (id: string, updateData: any) => {
    const res = await api.put(`/api/bookings/${id}`, updateData);
    return res.data;
  },
};

export const pricingAPI = {
  getAll: async () => {
    const res = await api.get('/api/pricing-rules');
    return res.data;
  },
  create: async (ruleData: any) => {
    const res = await api.post('/api/pricing-rules', ruleData);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/api/pricing-rules/${id}`);
    return res.data;
  },
};

export const logsAPI = {
  getAll: async () => {
    const res = await api.get('/api/logs');
    return res.data;
  },
};

export const settingsAPI = {
  get: async () => {
    const res = await api.get('/api/settings');
    return res.data;
  },
  update: async (settingsData: any) => {
    const res = await api.post('/api/settings', settingsData);
    return res.data;
  },
};

export const reportsAPI = {
  get: async () => {
    const res = await api.get('/api/reports');
    return res.data;
  },
};

export const aiAPI = {
  chat: async (messages: any[]) => {
    const res = await api.post('/api/ai-chat', { messages });
    return res.data;
  },
};

export default api;

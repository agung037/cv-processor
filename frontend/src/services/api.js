import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

// Create axios instance with base URL and credentials support
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API calls
export const auth = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    // Store token in localStorage
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }
};

// Admin API calls
export const admin = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { is_active: isActive });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }
};

// CV API calls
export const cv = {
  analyze: async (file) => {
    const formData = new FormData();
    formData.append('cv_file', file);
    
    const response = await api.post('/cv/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
};

// History API calls
export const history = {
  getAll: async () => {
    const response = await api.get('/history');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/history/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  }
};

export default api; 
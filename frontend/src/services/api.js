import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cozy_critter_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / unauthenticated states
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout if unauthenticated or token expires
      localStorage.removeItem('cozy_critter_token');
      // If we are not already on Landing/Login/Signup pages, we might want to redirect
      if (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: async (email, username, password) => {
    const response = await api.post('/signup', { email, username, password });
    return response.data;
  },

  login: async (username, password) => {
    // FastAPI's OAuth2PasswordRequestForm expects urlencoded form data
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    
    const response = await api.post('/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data.access_token) {
      localStorage.setItem('cozy_critter_token', response.data.access_token);
    }
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('cozy_critter_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('cozy_critter_token');
  }
};

export const critterService = {
  getAll: async () => {
    const response = await api.get('/critters/');
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/critters/${id}`);
    return response.data;
  },

  create: async (name, species, description) => {
    const response = await api.post('/critters/', { name, species, description });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/critters/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/critters/${id}`);
    return response.data;
  },

  // Interactions
  feed: async (id) => {
    const response = await api.post(`/critters/${id}/feed`);
    return response.data;
  },

  play: async (id) => {
    const response = await api.post(`/critters/${id}/play`);
    return response.data;
  },

  sleep: async (id) => {
    const response = await api.post(`/critters/${id}/sleep`);
    return response.data;
  }
};

export default api;

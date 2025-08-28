import axios, { AxiosError, AxiosResponse } from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  withCredentials: true, // Include httpOnly cookies
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest) {
      try {
        await api.post('/auth/refresh');
        return api.request(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
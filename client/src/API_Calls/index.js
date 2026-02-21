import axios from 'axios'
const API = import.meta.env.VITE_BACKEND_URL
export const axiosInstance = axios.create({
  baseURL: API,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
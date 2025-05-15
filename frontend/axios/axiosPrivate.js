import axios from 'axios';

// Base URL from environment variable
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Default axios instance
export default axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Private instance with authorization header
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Request interceptor to add authorization token
axiosPrivate.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for token refresh (can be expanded later)
axiosPrivate.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Handle token expiration (status 403) and prevent infinite loops
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // You can implement token refresh logic here if needed
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
        // localStorage.setItem('token', response.data.accessToken);
        // originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        // return axiosPrivate(originalRequest);
        
        // For now just clear tokens and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } catch (err) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);
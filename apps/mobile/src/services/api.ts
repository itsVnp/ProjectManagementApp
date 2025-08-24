import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE_URL = __DEV__ 
  ? Platform.select({
      ios: 'http://localhost:3001',
      android: 'http://10.0.2.2:3001',
    })
  : 'https://api.claro.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = config.headers.Authorization;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // You can redirect to login or refresh token here
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default api; 
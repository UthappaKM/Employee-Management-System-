import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Request interceptor to add token
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

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        const errorMessage = error.response.data?.message || '';
        
        // If token is invalid or expired, clear storage and redirect to login
        if (
          errorMessage.includes('Invalid token') ||
          errorMessage.includes('Token expired') ||
          errorMessage.includes('jwt malformed') ||
          errorMessage.includes('Not authorized')
        ) {
          console.log('Auth error detected, clearing localStorage and redirecting...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Redirect to login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?error=session_expired';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

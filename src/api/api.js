import axios from 'axios';

<<<<<<< HEAD
// Hosting-ready: reads from .env (VITE_ prefix required by Vite)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const AI_ENGINE_URL = import.meta.env.VITE_AI_ENGINE_URL || 'http://localhost:8001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
=======
export const AI_ENGINE_URL = 'http://localhost:8001';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
>>>>>>> himanshu
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
<<<<<<< HEAD
=======
            // Also support standard Bearer for scalability
>>>>>>> himanshu
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
<<<<<<< HEAD
    (error) => Promise.reject(error)
=======
    (error) => {
        return Promise.reject(error);
    }
>>>>>>> himanshu
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
<<<<<<< HEAD
=======
            // Global Session Expiry Handling
>>>>>>> himanshu
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

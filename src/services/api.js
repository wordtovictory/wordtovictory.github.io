import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Get the current host and port
const getBaseUrl = () => {
    const host = window.location.hostname;
    const port = '5000'; // Your backend port
    return host === 'localhost' || host === '127.0.0.1' 
        ? `http://localhost:${port}/api`
        : `http://${host}:${port}/api`;
};

const API_URL = process.env.REACT_APP_API_URL || getBaseUrl();

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to handle token
api.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
        // Get the token, forcing refresh if needed
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If error is due to token expiration and we haven't retried yet
        if (error.response?.status === 401 && 
            error.response?.data?.code === 'TOKEN_EXPIRED' && 
            !originalRequest._retry) {
            
            originalRequest._retry = true;
            
            // Get fresh token
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken(true);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            }
        }
        
        return Promise.reject(error);
    }
);

export const bible = {
    getRecords: () => api.get('/bible/records'),
    updateRecords: (readStatus) => api.post('/bible/records', { readStatus })
};

export default api; 
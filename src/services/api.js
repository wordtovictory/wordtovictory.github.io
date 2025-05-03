import axios from 'axios';

// Get the current host and port
const getBaseUrl = () => {
    const host = window.location.hostname;
    const port = '5000'; // Your backend port
    return host === 'localhost' || host === '127.0.0.1' 
        ? `http://localhost:${port}/api`
        : `http://${host}:${port}/api`;
};

const API_URL = process.env.REACT_APP_API_URL || getBaseUrl();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use(
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

export const bible = {
    getRecords: async () => {
        const response = await api.get('/bible/records');
        return response.data;
    },
    updateRecords: async (readStatus) => {
        const response = await api.post('/bible/records', { readStatus });
        return response.data;
    }
};

export default api; 
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5197/api', // Check the port from backend launchSettings
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

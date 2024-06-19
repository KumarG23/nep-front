// axiosConfig.js
import { url } from './api';
import axios from 'axios';
import getCookie from './getCookie';
// export const url = 'https://nep-back.fly.dev'
// export const url = 'http://127.0.0.1:8000';
// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to set the CSRF token on each request
axiosInstance.interceptors.request.use((config) => {
    // const token = getCookie('csrftoken');
    // if (token) {
    //     config.headers['X-CSRFToken'] = token;
    // }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;

// axiosConfig.js
import axios from 'axios';
import getCookie from './getCookie';
export const url = 'https://nep-back.fly.dev'
// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://nep-back.fly.dev',
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

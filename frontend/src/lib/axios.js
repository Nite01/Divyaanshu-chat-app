import axios from 'axios';

const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL || "http://localhost:5001";

export const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true,
});
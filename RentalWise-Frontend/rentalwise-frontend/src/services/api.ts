import axios from 'axios';

const API_BASE_URL = 'https://localhost:7199/api'; // Replace with your backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;

import axios from "axios";
import { API_BASE_URL, TOKEN_CYBERSOFT } from "@constants";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    config.headers = {
        ...config.headers,
        TokenCybersoft: TOKEN_CYBERSOFT,
    };
    return config;
});

export default api;
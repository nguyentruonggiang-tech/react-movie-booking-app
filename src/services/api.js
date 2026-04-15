import axios from "axios";
import { API_BASE_URL, TOKEN_CYBERSOFT } from "@constants";
import { getAccessTokenFromLocalStorage } from "@/utils/storage";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
    const token = getAccessTokenFromLocalStorage();
    config.headers = {
        ...config.headers,
        TokenCybersoft: TOKEN_CYBERSOFT,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return config;
});

export default api;

import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL, STORAGE_KEY_USER, TOKEN_CYBERSOFT } from "@constants";
import { buildLoginUrlWithRedirect } from "@/utils/navigation";
import { deleteLocalStorage, getAccessTokenFromLocalStorage } from "@/utils/storage";

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



let isHandlingUnauthorized401 = false;

function getAuthorizationHeaderFromConfig(config) {
    const headers = config?.headers;
    if (!headers) return "";
    if (typeof headers.get === "function") {
        return headers.get("Authorization") || headers.get("authorization") || "";
    }
    return headers.Authorization || headers.authorization || "";
}

function handleSessionExpired401() {
    if (isHandlingUnauthorized401) return;
    isHandlingUnauthorized401 = true;
    deleteLocalStorage(STORAGE_KEY_USER);
    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", { toastId: "session-expired-401" });
    const loginUrl = buildLoginUrlWithRedirect({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
    });
    window.location.assign(loginUrl);
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const authHeader = getAuthorizationHeaderFromConfig(error.config);
        const hadBearer = Boolean(authHeader && String(authHeader).startsWith("Bearer "));
        if (status === 401 && hadBearer) {
            handleSessionExpired401();
        }
        return Promise.reject(error);
    },
);

export default api;

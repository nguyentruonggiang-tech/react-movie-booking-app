import { ACCESS_TOKEN_TTL_MS, STORAGE_KEY_USER } from "@constants";

export function setLocalStorage(key, value) {
    try {
        localStorage.setItem(
            key,
            typeof value === "string" ? value : JSON.stringify(value),
        );
    } catch {
        /* ignore: quota / private mode */
    }
}

export function getLocalStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function deleteLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch {
        /* ignore: quota / private mode */
    }
}

export function getAccessTokenFromLocalStorage(key = STORAGE_KEY_USER) {
    const data = getLocalStorage(key);
    if (!data) return "";
    try {
        return JSON.parse(data)?.accessToken ?? "";
    } catch {
        return "";
    }
}

export function getUserRoleFromLocalStorage(key = STORAGE_KEY_USER) {
    const data = getLocalStorage(key);
    if (!data) return null;
    try {
        const role = JSON.parse(data)?.maLoaiNguoiDung;
        return typeof role === "string" ? role : null;
    } catch {
        return null;
    }
}

function parseStoredUserJson(key = STORAGE_KEY_USER) {
    const data = getLocalStorage(key);
    if (!data) return null;
    try {
        const parsed = JSON.parse(data);
        return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
        return null;
    }
}

export function isClientAccessTokenExpired(key = STORAGE_KEY_USER) {
    const user = parseStoredUserJson(key);
    const issued = user ? Number(user.accessTokenIssuedAt) : NaN;
    if (!Number.isFinite(issued)) return true;
    return Date.now() - issued > ACCESS_TOKEN_TTL_MS;
}

import { STORAGE_KEY_USER } from "@constants";

export function setLocalStorage(key, value) {
    try {
        localStorage.setItem(
            key,
            typeof value === "string" ? value : JSON.stringify(value),
        );
    } catch { }
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
    } catch {}
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

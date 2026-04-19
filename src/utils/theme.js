import { STORAGE_KEY_THEME } from "@constants";
import { getLocalStorage } from "@utils/storage";

export function normPref(raw) {
    if (raw === "light" || raw === "dark" || raw === "system") {
        return raw;
    }
    return "system";
}

export function readPref() {
    return normPref(getLocalStorage(STORAGE_KEY_THEME));
}

export function osDark() {
    if (typeof window === "undefined" || !window.matchMedia) {
        return false;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function modeFrom(pref, osDarkFlag) {
    if (pref === "dark") {
        return "dark";
    }
    if (pref === "light") {
        return "light";
    }
    return osDarkFlag ? "dark" : "light";
}

export function htmlDark(mode) {
    if (typeof document === "undefined") {
        return;
    }
    document.documentElement.classList.toggle("dark", mode === "dark");
}

export function subOsDark(onChange) {
    if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
}

export function osDarkSnap() {
    return osDark();
}

export function osDarkServer() {
    return false;
}

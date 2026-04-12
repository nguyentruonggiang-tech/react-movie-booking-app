import { SHOWTIME_NO_IMAGE_URL } from "./constants";

export function imgSrc(url) {
    return url?.trim?.() || "";
}

export function onImgError(event) {
    const img = event.currentTarget;
    if (img.dataset.useNoImage === "1") return;
    img.dataset.useNoImage = "1";
    img.src = SHOWTIME_NO_IMAGE_URL;
}

function dateToKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function sessionDayKey(session) {
    const d = new Date(session.ngayChieuGioChieu);
    if (Number.isNaN(d.getTime())) return null;
    return dateToKey(d);
}

export function showtimeLabel(date) {
    const d = new Date(date);
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${min}`;
}

export function sortedDayKeys(clusters) {
    const keys = new Set();
    for (const cluster of clusters) {
        for (const s of cluster.lichChieuPhim ?? []) {
            const k = sessionDayKey(s);
            if (k) keys.add(k);
        }
    }
    return [...keys].sort();
}

export function sessionsForDay(sessions, dayKey) {
    return (sessions ?? []).filter((s) => sessionDayKey(s) === dayKey);
}

/** Google Maps search URL for a raw address string. */
export function googleMapsSearchUrl(diaChi) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(diaChi)}`;
}

/** Check if an image URL loads successfully (using Image — fetch HEAD may fail with CORS). */
export function checkImageUrlExists(url, timeoutMs = 8000) {
    const src = (url ?? "").trim();
    if (!src) return Promise.resolve(false);

    return new Promise((resolve) => {
        let done = false;
        const t = setTimeout(() => {
            if (done) return;
            done = true;
            resolve(false);
        }, timeoutMs);

        const img = new Image();
        img.onload = () => {
            if (done) return;
            done = true;
            clearTimeout(t);
            resolve(true);
        };
        img.onerror = () => {
            if (done) return;
            done = true;
            clearTimeout(t);
            resolve(false);
        };
        img.src = src;
    });
}
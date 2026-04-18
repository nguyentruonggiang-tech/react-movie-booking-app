export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const TOKEN_CYBERSOFT = import.meta.env.VITE_TOKEN_CYBERSOFT;
export const MA_NHOM = import.meta.env.VITE_MA_NHOM;

export const SITE_NAME = import.meta.env.VITE_SITE_NAME || "Movie Booking";

/** Values for `maLoaiNguoiDung` from API */
export const USER_ROLE_CUSTOMER = "KhachHang";
export const USER_ROLE_ADMIN = "QuanTri";

/** localStorage keys for persisted user JSON. */
export const STORAGE_KEY_USER = "USER_INFO";

/** Client-side session length for access token (ms). Optional: `VITE_ACCESS_TOKEN_TTL_MS`; default 1 hour. */
export const ACCESS_TOKEN_TTL_MS =
    Number(import.meta.env.VITE_ACCESS_TOKEN_TTL_MS) || 60 * 60 * 1000;

export const STORAGE_KEY_SELECTED_SEATS = "SELECTED_SEATS";

/** Admin page size */
export const ADMIN_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 500;
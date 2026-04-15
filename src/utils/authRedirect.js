import { USER_ROLE_ADMIN, USER_ROLE_CUSTOMER } from "@constants";

function getDefaultPathForRole(maLoaiNguoiDung) {
    if (maLoaiNguoiDung === USER_ROLE_ADMIN) return "/admin/dashboard";
    if (maLoaiNguoiDung === USER_ROLE_CUSTOMER) return "/home";
    return "/home";
}

/** Same-app path only; blocks open redirects and /login /register loops. */
export function getSafeRedirectURL(redirectURL) {
    if (typeof redirectURL !== "string") return null;

    let path = redirectURL.trim();
    if (!path) return null;
    try {
        path = decodeURIComponent(path);
    } catch {
        return null;
    }

    const base = path.split(/[?#]/)[0];
    const lower = path.toLowerCase();
    const bad =
        path.length > 2048 ||
        !path.startsWith("/") ||
        path.startsWith("//") ||
        /[\s<>\\]/.test(path) ||
        base.includes("//") ||
        lower.startsWith("/login") ||
        lower.startsWith("/register");
    return bad ? null : path;
}

export function getPathAfterLogin(redirectURL, userRole) {
    const roleDefault = getDefaultPathForRole(userRole);
    const safe = getSafeRedirectURL(redirectURL);
    if (!safe) return roleDefault;
    return safe;
}

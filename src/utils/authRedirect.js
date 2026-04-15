import { USER_ROLE_ADMIN, USER_ROLE_CUSTOMER } from "@constants";

export function getPathAfterLogin(maLoaiNguoiDung) {
    if (maLoaiNguoiDung === USER_ROLE_ADMIN) return "/admin/dashboard";
    if (maLoaiNguoiDung === USER_ROLE_CUSTOMER) return "/home";
    return "/home";
}

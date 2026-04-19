import { Link } from "react-router-dom";
import { Edit } from "flowbite-react-icons/outline";
import { USER_ROLE_ADMIN, USER_ROLE_CUSTOMER } from "@constants";
import UserSkeleton from "./UserSkeleton";

function formatPhoneDisplay(raw) {
    if (raw == null || String(raw).trim() === "") {
        return "—";
    }
    const digits = String(raw).replace(/\D/g, "");
    if (!digits) {
        return "—";
    }
    const parts = [];
    let remaining = digits;
    while (remaining.length > 3) {
        parts.unshift(remaining.slice(-3));
        remaining = remaining.slice(0, -3);
    }
    if (remaining) {
        parts.unshift(remaining);
    }
    return parts.join(" ");
}

function roleBadgeClass(maLoaiNguoiDung) {
    const code =
        maLoaiNguoiDung == null ? "" : String(maLoaiNguoiDung).trim();
    if (code === USER_ROLE_ADMIN) {
        return "bg-rose-600/90 text-white";
    }
    if (code === USER_ROLE_CUSTOMER) {
        return "bg-sky-600/90 text-white";
    }
    return "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200";
}

/**
 * Prefer role name fields returned on each list row; otherwise map by `maLoaiNguoiDung`
 * using `LayDanhSachLoaiNguoiDung` options (same shape as UserForm).
 */
function resolveRoleDisplayText(user, roleTypeRows) {
    const fromListRow =
        user?.tenLoaiNguoiDung ?? user?.tenLoai ?? user?.ten;
    if (fromListRow != null && String(fromListRow).trim() !== "") {
        return String(fromListRow).trim();
    }
    const code = String(user?.maLoaiNguoiDung ?? user?.maLoai ?? "").trim();
    if (!code) {
        return "—";
    }
    const rows = Array.isArray(roleTypeRows) ? roleTypeRows : [];
    const matched = rows.find(
        (row) =>
            String(row?.maLoaiNguoiDung ?? row?.maLoai ?? "").trim() === code,
    );
    if (matched) {
        const name =
            matched.tenLoai ??
            matched.tenLoaiNguoiDung ??
            matched.ten ??
            "";
        if (String(name).trim() !== "") {
            return String(name).trim();
        }
    }
    return code;
}

export default function UserTable({
    data,
    loading,
    serialStart = 1,
    roleTypeOptions = [],
}) {
    const items = Array.isArray(data) ? data : [];

    if (loading) {
        return <UserSkeleton />;
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-zinc-100 dark:bg-zinc-800">
                    <tr className="border-b border-zinc-200/90 dark:border-zinc-800/90">
                        <th className="w-14 align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                            STT
                        </th>
                        <th className="align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                            Tài khoản
                        </th>
                        <th className="align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                            Họ tên
                        </th>
                        <th className="align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                            Email
                        </th>
                        <th className="align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                            Điện thoại
                        </th>
                        <th className="align-middle px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                            Vai trò
                        </th>
                        <th className="align-middle px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80 bg-white dark:divide-zinc-800/70 dark:bg-zinc-900">
                    {items.map((user, index) => {
                        const taiKhoan = user?.taiKhoan ?? "";
                        const editPath = `/admin/users/edit/${encodeURIComponent(String(taiKhoan))}`;
                        const serialNumber = serialStart + index;
                        const roleDisplayText = resolveRoleDisplayText(
                            user,
                            roleTypeOptions,
                        );

                        return (
                            <tr key={`user-${taiKhoan || user?.email}`} className="align-middle">
                                <td className="w-14 align-middle whitespace-nowrap px-5 py-3 tabular-nums text-zinc-700 dark:text-zinc-200">
                                    {serialNumber}
                                </td>
                                <td className="align-middle px-5 py-3">
                                    <Link
                                        to={editPath}
                                        className="block min-w-0 truncate font-medium text-zinc-900 hover:text-rose-600 dark:text-white dark:hover:text-rose-400"
                                        title={taiKhoan}
                                    >
                                        {taiKhoan || "—"}
                                    </Link>
                                </td>
                                <td className="max-w-[12rem] align-middle px-5 py-3 text-zinc-800 dark:text-zinc-200">
                                    <span className="line-clamp-2" title={user?.hoTen}>
                                        {user?.hoTen?.trim() || "—"}
                                    </span>
                                </td>
                                <td className="max-w-[14rem] align-middle px-5 py-3 text-zinc-700 dark:text-zinc-300">
                                    <span className="line-clamp-2 break-all" title={user?.email}>
                                        {user?.email?.trim() || "—"}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 align-middle tabular-nums text-zinc-700 dark:text-zinc-300">
                                    {formatPhoneDisplay(user?.soDt)}
                                </td>
                                <td className="align-middle px-5 py-3 text-center">
                                    <span
                                        className={`inline-flex max-w-full flex-wrap items-center justify-center whitespace-normal break-words rounded-lg px-2.5 py-1 text-center text-xs font-semibold leading-snug ${roleBadgeClass(user?.maLoaiNguoiDung ?? user?.maLoai)}`}
                                        title={roleDisplayText}
                                    >
                                        {roleDisplayText}
                                    </span>
                                </td>
                                <td className="align-middle px-5 py-3">
                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                        <Link
                                            to={editPath}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-200 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-rose-400"
                                            title="Sửa"
                                        >
                                            <Edit className="h-4 w-4 shrink-0" aria-hidden />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

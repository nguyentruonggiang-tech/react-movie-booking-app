import { Link } from "react-router-dom";
import { Edit } from "flowbite-react-icons/outline";
import { USER_ROLE_ADMIN } from "@constants";
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
    if (maLoaiNguoiDung === USER_ROLE_ADMIN) {
        return "bg-rose-600/90 text-white";
    }
    return "bg-zinc-700 text-zinc-200";
}

function roleLabel(maLoaiNguoiDung) {
    if (maLoaiNguoiDung === USER_ROLE_ADMIN) {
        return "ADMIN";
    }
    return "USER";
}

export default function UserTable({ data, loading, serialStart = 1 }) {
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
                <thead className="bg-zinc-800">
                    <tr className="border-b border-zinc-800/90">
                        <th className="w-14 align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            No
                        </th>
                        <th className="align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Account
                        </th>
                        <th className="align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Full name
                        </th>
                        <th className="align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Email
                        </th>
                        <th className="align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Phone
                        </th>
                        <th className="align-middle px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Role
                        </th>
                        <th className="align-middle px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70 bg-zinc-900">
                    {items.map((user, index) => {
                        const taiKhoan = user?.taiKhoan ?? "";
                        const editPath = `/admin/users/edit/${encodeURIComponent(String(taiKhoan))}`;
                        const serialNumber = serialStart + index;

                        return (
                            <tr key={`user-${taiKhoan || user?.email}`} className="align-middle">
                                <td className="w-14 align-middle whitespace-nowrap px-5 py-3 tabular-nums text-zinc-200">
                                    {serialNumber}
                                </td>
                                <td className="align-middle px-5 py-3">
                                    <Link
                                        to={editPath}
                                        className="block min-w-0 truncate font-medium text-white hover:text-rose-400"
                                        title={taiKhoan}
                                    >
                                        {taiKhoan || "—"}
                                    </Link>
                                </td>
                                <td className="max-w-[12rem] align-middle px-5 py-3 text-zinc-200">
                                    <span className="line-clamp-2" title={user?.hoTen}>
                                        {user?.hoTen?.trim() || "—"}
                                    </span>
                                </td>
                                <td className="max-w-[14rem] align-middle px-5 py-3 text-zinc-300">
                                    <span className="line-clamp-2 break-all" title={user?.email}>
                                        {user?.email?.trim() || "—"}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 align-middle tabular-nums text-zinc-300">
                                    {formatPhoneDisplay(user?.soDt)}
                                </td>
                                <td className="align-middle px-5 py-3">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${roleBadgeClass(user?.maLoaiNguoiDung)}`}
                                    >
                                        {roleLabel(user?.maLoaiNguoiDung)}
                                    </span>
                                </td>
                                <td className="align-middle px-5 py-3">
                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                        <Link
                                            to={editPath}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-zinc-800/70 hover:text-rose-400"
                                            title="Edit"
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

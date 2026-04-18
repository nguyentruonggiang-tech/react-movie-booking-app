import { NavLink } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center text-slate-100">
            <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
            <p className="max-w-md text-sm text-slate-400">
                Đường dẫn bạn truy cập không tồn tại hoặc đã được đổi.
            </p>
            <NavLink
                to="/"
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
                Về trang chủ
            </NavLink>
        </div>
    );
}
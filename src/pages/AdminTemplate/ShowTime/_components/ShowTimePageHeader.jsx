import { Link } from "react-router-dom";

export default function ShowTimePageHeader() {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
                <Link
                    to="/admin/films"
                    className="text-sm font-medium text-rose-600 transition hover:text-rose-500 dark:text-rose-400 dark:hover:text-rose-300"
                >
                    ← Danh sách phim
                </Link>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
                    Tạo lịch chiếu
                </h1>
                <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                    Thiết lập suất chiếu mới cho phim đang chọn.
                </p>
            </div>
        </div>
    );
}

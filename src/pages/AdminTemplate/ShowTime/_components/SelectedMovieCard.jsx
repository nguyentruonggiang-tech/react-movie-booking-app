import { Link } from "react-router-dom";
import { formatDateDisplay } from "@utils/dateUtils";

export default function SelectedMovieCard({ movie, editHref }) {
    return (
        <aside className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-zinc-900 shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">
                Phim đang chọn
            </p>
            {movie ? (
                <div className="mt-4 flex gap-4">
                    <div className="h-24 w-16 shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                        {movie.hinhAnh ? (
                            <img
                                src={movie.hinhAnh}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-xs text-zinc-500 dark:text-zinc-500">
                                —
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-lg font-bold leading-snug text-zinc-900 dark:text-white">
                            {movie.tenPhim}
                        </p>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            Ngày khởi chiếu:{" "}
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                {formatDateDisplay(movie.ngayKhoiChieu) || "—"}
                            </span>
                        </p>
                        <Link
                            to={editHref}
                            className="mt-4 inline-block text-sm font-medium text-rose-600 transition hover:text-rose-500 dark:text-rose-400 dark:hover:text-rose-300"
                        >
                            Sửa thông tin phim →
                        </Link>
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-500">Chưa có dữ liệu phim.</p>
            )}
        </aside>
    );
}

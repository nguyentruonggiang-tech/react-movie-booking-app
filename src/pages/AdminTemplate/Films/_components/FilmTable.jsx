import { Link } from "react-router-dom";
import { CalendarMonth, CalendarPlus, Edit, TrashBin } from "flowbite-react-icons/outline";
import FilmSkeleton from "./FilmSkeleton";
import { formatDateDisplay } from "@utils/dateUtils";    
import RatingBadge from "@/pages/AdminTemplate/_components/RatingBade";

const FILM_LISTING_FLAGS = [
    { field: "hot", label: "Nổi bật" },
    { field: "dangChieu", label: "Đang chiếu" },
    { field: "sapChieu", label: "Sắp chiếu" },
];

export default function FilmTable({ data, loading, onDelete, deletingMaPhim }) {
    const items = Array.isArray(data) ? data : [];

    if (loading) {
        return (
            <>
                {/* Loading header */}
                <div
                    className="border-b border-zinc-800/80 bg-zinc-800 px-5 py-4"
                    aria-hidden
                >
                    <div className="h-3 w-48 max-w-full rounded bg-zinc-700/40" />
                </div>
                {/* Loading table rows */}
                <div className="bg-zinc-900 px-5 py-3">
                    <FilmSkeleton />
                </div>
                {/* Loading pagination */}
                <div className="flex items-center justify-between border-t border-zinc-800/70 bg-zinc-900 px-5 py-4" aria-hidden>
                    <div className="h-3 w-24 rounded bg-zinc-700/40" />
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded bg-zinc-700/40" />
                        <div className="h-8 w-8 rounded bg-zinc-700/40" />
                        <div className="h-8 w-8 rounded bg-zinc-700/40" />
                    </div>
                </div>
            </>
        );
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-zinc-800">
                    <tr className="border-b border-zinc-800/90">
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Phim
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Ngày khởi chiếu
                        </th>
                        <th className="min-w-[5.5rem] whitespace-nowrap px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Đánh giá
                        </th>
                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70 bg-zinc-900">
                    {items.map((film) => (
                        <tr key={film.maPhim} className="align-middle">
                            <td className="px-5 py-3 align-top">
                                <div className="flex items-stretch gap-2">
                                    <Link to={`/admin/films/edit/${film.maPhim}`}>
                                        <img
                                            src={film.hinhAnh}
                                            alt=""
                                            className="h-12 w-9 shrink-0 self-start rounded object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='48'%3E%3Crect fill='%233f3f46' width='36' height='48'/%3E%3C/svg%3E";
                                            }}
                                        />
                                    </Link>

                                    <div className="flex min-h-12 min-w-0 max-w-[13rem] flex-1 flex-col justify-between gap-1 sm:max-w-[15rem]">
                                        <Link
                                            to={`/admin/films/edit/${film.maPhim}`}
                                            className="line-clamp-2 text-sm font-medium leading-tight text-white hover:text-rose-400"
                                            title={film.tenPhim}
                                        >
                                            {film.tenPhim}
                                        </Link>

                                        <div className="flex flex-wrap gap-1">
                                            {FILM_LISTING_FLAGS.map(({ field, label }) => {
                                                const on = Boolean(film[field]);
                                                return (
                                                    <span
                                                        key={field}
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                            on
                                                                ? "bg-rose-600/25 text-rose-200"
                                                                : "bg-zinc-800/90 text-zinc-500 opacity-80"
                                                        }`}
                                                    >
                                                        {label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-3 text-zinc-300">
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarMonth
                                        className="h-4 w-4 shrink-0 text-rose-500"
                                        aria-hidden
                                    />
                                    {formatDateDisplay(film.ngayKhoiChieu)}
                                </span>
                            </td>
                            <td className="min-w-[5.5rem] whitespace-nowrap px-4 py-3 text-center tabular-nums text-zinc-200">
                                <RatingBadge value={film.danhGia} />
                            </td>
                            <td className="px-5 py-3">
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                    <Link
                                        to={`/admin/films/edit/${film.maPhim}`}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-zinc-800/70 hover:text-rose-400"
                                        title="Sửa"
                                    >
                                        <Edit className="h-4 w-4 shrink-0" aria-hidden />
                                    </Link>
                                    <button
                                        type="button"
                                        title="Xóa"
                                        disabled={
                                            loading || deletingMaPhim === film.maPhim
                                        }
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-zinc-800/70 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                                        onClick={() => onDelete?.(film)}
                                    >
                                        <TrashBin className="h-4 w-4" aria-hidden />
                                    </button>
                                    <Link
                                        to={`/admin/films/showtime/${film.maPhim}`}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-600 bg-rose-600/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-600/20"
                                    >
                                        <CalendarPlus
                                            className="h-3.5 w-3.5 shrink-0"
                                            aria-hidden
                                        />
                                        Tạo lịch chiếu
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

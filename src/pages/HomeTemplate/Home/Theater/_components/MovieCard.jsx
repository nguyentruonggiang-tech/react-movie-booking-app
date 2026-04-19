import { NavLink } from "react-router-dom";
import ShowtimeItem from "./ShowtimeItem";

export default function MovieCard({ movie }) {
    const showtimes = Array.isArray(movie?.lstLichChieuTheoPhim)
        ? movie.lstLichChieuTheoPhim
        : [];

    const maPhim = movie?.maPhim;
    const detailTo =
        maPhim != null && String(maPhim).trim() !== ""
            ? `/detail/${maPhim}`
            : null;

    const poster =
        movie?.hinhAnh ||
        "https://placehold.co/96x144/18181b/e4e4e7?text=Movie";
    const title =
        typeof movie?.tenPhim === "string" ? movie.tenPhim.trim() : "";
    const displayTitle = title || "Chưa có tên phim";

    const posterInner = (
        <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover transition group/poster:opacity-90"
            loading="lazy"
        />
    );

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-zinc-800/70">
            <div className="flex gap-4">
                <div className="group/poster h-24 w-16 shrink-0 overflow-hidden rounded-md bg-slate-200 ring-offset-2 ring-offset-white dark:bg-zinc-900 dark:ring-offset-zinc-900">
                    {detailTo ? (
                        <NavLink
                            to={detailTo}
                            className="block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
                        >
                            {posterInner}
                        </NavLink>
                    ) : (
                        posterInner
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    {detailTo ? (
                        <NavLink
                            to={detailTo}
                            className="line-clamp-1 block text-base font-bold text-slate-900 transition hover:text-red-600 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-white dark:hover:text-red-400"
                        >
                            {displayTitle}
                        </NavLink>
                    ) : (
                        <p className="line-clamp-1 text-base font-bold text-slate-900 dark:text-white">
                            {displayTitle}
                        </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                        {showtimes.slice(0, 8).map((showtime, index) => (
                            <ShowtimeItem
                                key={showtime?.maLichChieu || index}
                                showtime={showtime}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
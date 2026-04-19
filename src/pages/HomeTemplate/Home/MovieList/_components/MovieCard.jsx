import { memo, useState } from "react";
import { NavLink } from "react-router-dom";
import { InfoIcon, PlayIcon } from "@pages/HomeTemplate/_components/icons";

const movieCardActionIconClassName = "h-5 w-5 shrink-0";

function formatRating(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return n.toFixed(1);
}

function MovieCard({ movie }) {
    const [imgFailed, setImgFailed] = useState(false);
    const maPhim = movie?.maPhim;
    const title = movie?.tenPhim ?? "Chưa có tên";
    const poster = movie?.hinhAnh || "";
    const rating = formatRating(movie?.danhGia);

    const detailTo = maPhim != null ? `/detail/${maPhim}` : "#";
    const isHot = movie?.hot === true || movie?.hot === 1;

    return (
        <div className="group relative">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#23262c] shadow-2xl shadow-black/40 transition-transform duration-500 group-hover:scale-[1.02]">
                {!imgFailed && poster ? (
                    <img
                        src={poster}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-center text-xs text-white/40">
                        Không có poster
                    </div>
                )}

                {isHot ? (
                    <div
                        className="absolute left-4 top-4 rounded bg-amber-500 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-900 shadow-sm"
                        title="Phim hot"
                    >
                        Hot
                    </div>
                ) : null}

                {rating != null ? (
                    <div className="absolute right-4 top-4 rounded bg-red-600/90 px-2 py-1 text-xs font-black text-white">
                        {rating}
                    </div>
                ) : null}

                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex flex-col gap-2">
                        <NavLink
                            to={detailTo}
                            className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-black uppercase text-white shadow-lg shadow-red-600/20 transition-all duration-200 ease-out hover:bg-red-500 hover:shadow-xl hover:shadow-red-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 active:scale-[0.98]"
                        >
                            <PlayIcon
                                className={`${movieCardActionIconClassName} transition-transform duration-200 ease-out group-hover/btn:scale-110`}
                            />
                            Đặt vé ngay
                        </NavLink>
                        <NavLink
                            to={detailTo}
                            className="group/btn2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/10 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 ease-out hover:border-white/25 hover:bg-white/20 hover:shadow-lg hover:shadow-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:scale-[0.98]"
                        >
                            <InfoIcon
                                className={`${movieCardActionIconClassName} transition-transform duration-200 ease-out group-hover/btn2:scale-110`}
                            />
                            Xem chi tiết
                        </NavLink>
                    </div>
                </div>
            </div>

            <div className="relative mt-6">
                <NavLink to={detailTo}>
                    <h3 className="font-sans text-xl font-bold text-slate-900 transition-colors group-hover:text-red-600 dark:text-white dark:group-hover:text-red-500">
                        {title}
                    </h3>
                </NavLink>
            </div>
        </div>
    );
}

export default memo(MovieCard);

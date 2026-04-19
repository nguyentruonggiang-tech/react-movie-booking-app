import { NavLink } from "react-router-dom";
import { IconStarFilled, PlayIcon } from "@pages/HomeTemplate/_components/icons";

function formatRating(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return n.toFixed(1);
}

export default function MovieInfo({ data }) {
    const date = new Date(data.ngayKhoiChieu);
    const releaseDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const isNowShowing = data.dangChieu === true;
    const isComingSoon = data.sapChieu === true;
    const isHot = data.hot === true;
    const ratingText = formatRating(data.danhGia);

    return (
        <div className="relative z-10 w-full text-slate-800 dark:text-[#f6f6fc]">
            <div className="mx-auto max-w-7xl px-8 py-4 md:py-6">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 border-b border-slate-200 pb-4 text-sm text-slate-600 dark:border-white/10 dark:text-zinc-300"
                >
                    <ol className="flex min-w-0 items-center gap-2">
                        <li>
                            <NavLink
                                to="/"
                                className="transition-colors hover:text-red-600 dark:hover:text-white"
                            >
                                Trang chủ
                            </NavLink>
                        </li>
                        <li className="text-slate-400 dark:text-zinc-500">|</li>
                        <li className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-medium uppercase tracking-wide text-slate-500 sm:text-sm dark:text-zinc-400">
                                {data.tenPhim}
                            </span>
                        </li>
                    </ol>
                </nav>

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
                    <div className="mx-auto w-full max-w-[180px] shrink-0 lg:mx-0 lg:max-w-[220px]">
                        <div className="overflow-hidden rounded-lg shadow-lg shadow-slate-900/15 ring-1 ring-slate-200 dark:shadow-black/60 dark:ring-white/10">
                            <img
                                src={data.hinhAnh}
                                alt={data.tenPhim}
                                className="aspect-[2/3] w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h1 className="pb-0.5 text-2xl font-black uppercase leading-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            {data.tenPhim}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            {ratingText != null ? (
                                <div
                                    className="inline-flex h-7 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 shadow-sm dark:border-white/10 dark:bg-white/10 dark:shadow-none dark:backdrop-blur-md"
                                    aria-label={`Đánh giá ${ratingText}`}
                                >
                                    <IconStarFilled className="h-3.5 w-3.5 shrink-0 text-amber-500 dark:text-amber-200" />
                                    <span className="text-xs font-black tabular-nums leading-none text-slate-900 sm:text-sm dark:text-white">
                                        {ratingText}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm text-slate-500 dark:text-zinc-500">Chưa có đánh giá</span>
                            )}

                            {isNowShowing && (
                                <span className="inline-flex h-7 items-center rounded-md border border-red-500/50 bg-red-500/10 px-2.5 text-xs font-bold uppercase leading-none text-red-400">
                                    Đang chiếu
                                </span>
                            )}

                            {isComingSoon && (
                                <span className="inline-flex h-7 items-center rounded-md border border-slate-400 bg-slate-100 px-2.5 text-xs font-bold uppercase leading-none text-slate-700 dark:border-zinc-500/50 dark:bg-zinc-500/10 dark:text-zinc-300">
                                    Sắp chiếu
                                </span>
                            )}

                            {isHot && (
                                <span className="inline-flex h-7 items-center rounded-md bg-amber-500 px-2.5 text-xs font-black uppercase leading-none tracking-wide text-zinc-900 shadow-sm">
                                    Hot
                                </span>
                            )}
                        </div>

                        <p
                            className="mt-4 w-full text-sm leading-relaxed text-slate-600 line-clamp-3 sm:text-base dark:text-zinc-300"
                            title={data.moTa}
                        >
                            {data.moTa}
                        </p>

                        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
                            <p className="text-sm text-slate-900 dark:text-white">
                                <span className="font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">
                                    Ngày khởi chiếu:
                                </span>{" "}
                                {releaseDate}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:flex-wrap dark:border-white/10">
                            {data.trailer && (
                                <a
                                    href={data.trailer}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group/trailer inline-flex w-fit max-w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-slate-800 shadow-sm transition-all duration-200 ease-out hover:border-red-400 hover:bg-red-50 hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 active:scale-[0.98] dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-none dark:backdrop-blur-md dark:hover:border-white/25 dark:hover:bg-white/20 dark:hover:text-white dark:hover:shadow-lg dark:hover:shadow-black/20 dark:focus-visible:outline-white/50"
                                >
                                    <PlayIcon className="h-4 w-4 shrink-0 text-slate-700 transition-transform duration-200 ease-out group-hover/trailer:scale-110 dark:text-white" />
                                    Xem trailer
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

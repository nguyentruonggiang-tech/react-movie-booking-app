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
        <div className="relative z-10 w-full text-[#f6f6fc]">
            <div className="mx-auto max-w-7xl px-8 pb-16 pt-4 md:pb-24">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 border-b border-white/10 pb-4 text-sm text-zinc-300"
                >
                    <ol className="flex min-w-0 items-center gap-2">
                        <li>
                            <NavLink
                                to="/"
                                className="transition-colors hover:text-white"
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="text-zinc-500">|</li>
                        <li className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-medium uppercase tracking-wide text-zinc-400 sm:text-sm">
                                {data.tenPhim}
                            </span>
                        </li>
                    </ol>
                </nav>

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
                    <div className="mx-auto w-full max-w-[180px] shrink-0 lg:mx-0 lg:max-w-[220px]">
                        <div className="overflow-hidden rounded-lg shadow-xl shadow-black/60 ring-1 ring-white/10">
                            <img
                                src={data.hinhAnh}
                                alt={data.tenPhim}
                                className="aspect-[2/3] w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                            {data.tenPhim}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            {ratingText != null ? (
                                <div
                                    className="inline-flex h-7 items-center gap-1.5 rounded-md border border-white/10 bg-white/10 px-2.5 backdrop-blur-md"
                                    aria-label={`Rating ${ratingText}`}
                                >
                                    <IconStarFilled className="h-3.5 w-3.5 shrink-0 text-amber-200" />
                                    <span className="text-xs font-black tabular-nums leading-none text-white sm:text-sm">
                                        {ratingText}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm text-zinc-500">No rating</span>
                            )}

                            {isNowShowing && (
                                <span className="inline-flex h-7 items-center rounded-md border border-red-500/50 bg-red-500/10 px-2.5 text-xs font-bold uppercase leading-none text-red-400">
                                    Now showing
                                </span>
                            )}

                            {isComingSoon && (
                                <span className="inline-flex h-7 items-center rounded-md border border-zinc-500/50 bg-zinc-500/10 px-2.5 text-xs font-bold uppercase leading-none text-zinc-300">
                                    Coming soon
                                </span>
                            )}

                            {isHot && (
                                <span className="inline-flex h-7 items-center rounded-md bg-amber-500 px-2.5 text-xs font-black uppercase leading-none tracking-wide text-zinc-900 shadow-sm">
                                    Hot
                                </span>
                            )}
                        </div>

                        <p
                            className="w-full mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base line-clamp-3"
                            title={data.moTa}
                        >
                            {data.moTa}
                        </p>

                        <div className="mt-5 border-t border-white/10 pt-4">
                            <p className="text-sm text-white">
                                <span className="font-semibold uppercase tracking-wide text-sky-400">
                                    Release date:
                                </span>{" "}
                                {releaseDate}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:flex-wrap">
                            {data.trailer && (
                                <a
                                    href={data.trailer}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group/trailer inline-flex w-fit max-w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-md transition-all duration-200 ease-out hover:border-white/25 hover:bg-white/20 hover:shadow-lg hover:shadow-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:scale-[0.98]"
                                >
                                    <PlayIcon className="h-4 w-4 shrink-0 text-white transition-transform duration-200 ease-out group-hover/trailer:scale-110" />
                                    Watch trailer
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
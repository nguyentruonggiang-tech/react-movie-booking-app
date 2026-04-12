import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    clearMovieShowtimes,
    fetchMovieShowtimes,
} from "./slice";

import Loading from "./_components/Loading";
import ErrorBox from "./_components/ErrorBox";
import NotFound from "./_components/NotFound";
import {
    SHOWTIME_COLUMN_CLASS,
    SHOWTIME_NO_IMAGE_URL,
    WEEKDAY_LABELS_EN,
} from "./constants";
import {
    checkImageUrlExists,
    googleMapsSearchUrl,
    imgSrc,
    onImgError,
    sessionsForDay,
    showtimeLabel,
    sortedDayKeys,
} from "./utils";

// Tạm thời để trong index — hinhAnh → fallbackRawUrl (logo HT) → noimage.
function ShowtimeVerifiedImg({ rawUrl, fallbackRawUrl, ...imgProps }) {
    const [src, setSrc] = useState(SHOWTIME_NO_IMAGE_URL);

    useEffect(() => {
        let alive = true;
        const primary = imgSrc(rawUrl);
        const fallback = imgSrc(fallbackRawUrl ?? "");

        queueMicrotask(() => {
            if (alive) setSrc(SHOWTIME_NO_IMAGE_URL);
        });

        (async () => {
            if (primary && (await checkImageUrlExists(primary))) {
                if (alive) setSrc(primary);
                return;
            }
            if (fallback && (await checkImageUrlExists(fallback))) {
                if (alive) setSrc(fallback);
                return;
            }
            if (alive) setSrc(SHOWTIME_NO_IMAGE_URL);
        })();

        return () => {
            alive = false;
        };
    }, [rawUrl, fallbackRawUrl]);

    return <img src={src} {...imgProps} onError={onImgError} />;
}

const ShowtimeSection = () => {
    const { maPhim } = useParams();
    const dispatch = useDispatch();

    const { data, loading, error } = useSelector(
        (state) => state.movieShowtimesReducer,
    );

    const [selectedTheaterSystemCode, setSelectedTheaterSystemCode] =
        useState(null);
    const [selectedShowingDateKey, setSelectedShowingDateKey] =
        useState(null);

    useEffect(() => {
        if (!maPhim) return;
        dispatch(fetchMovieShowtimes(maPhim));
        return () => {
            dispatch(clearMovieShowtimes());
        };
    }, [maPhim, dispatch]);

    const theaterSystems = data?.heThongRapChieu ?? [];
    const fallbackSystemCode = theaterSystems[0]?.maHeThongRap ?? null;
    const activeTheaterSystemCode =
        selectedTheaterSystemCode &&
        theaterSystems.some((s) => s.maHeThongRap === selectedTheaterSystemCode)
            ? selectedTheaterSystemCode
            : fallbackSystemCode;

    const activeTheaterSystem =
        theaterSystems.find((s) => s.maHeThongRap === activeTheaterSystemCode) ??
        null;
    const theaterClusters = activeTheaterSystem?.cumRapChieu ?? [];
    const sortedShowingDateKeys = sortedDayKeys(theaterClusters);
    const activeShowingDateKey =
        sortedShowingDateKeys.find((k) => k === selectedShowingDateKey) ??
        sortedShowingDateKeys[0] ??
        null;

    if (loading) return <Loading />;

    if (error) {
        return (
            <ErrorBox
                onRetry={() => dispatch(fetchMovieShowtimes(maPhim))}
            />
        );
    }

    if (!theaterSystems.length) return <NotFound />;

    return (
        <section
            className="relative z-10 mx-auto mt-10 w-full min-w-0 max-w-7xl overflow-x-hidden px-8 pb-6 md:pb-8"
            aria-labelledby="movie-showtimes-heading"
        >
            <h2
                id="movie-showtimes-heading"
                className="mb-8 text-4xl font-black uppercase tracking-tight text-white"
            >
                Showtimes
            </h2>

            <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[96px_minmax(0,1fr)] lg:items-stretch">
                <div className="min-w-0">
                    <div className={`${SHOWTIME_COLUMN_CLASS} p-3`}>
                        <div className="theater-scrollbar h-full space-y-3 overflow-y-auto overflow-x-hidden pr-1">
                            {theaterSystems.map((system) => {
                                const isActive =
                                    system.maHeThongRap ===
                                    activeTheaterSystemCode;

                                return (
                                    <button
                                        key={system.maHeThongRap}
                                        type="button"
                                        onClick={() =>
                                            setSelectedTheaterSystemCode(
                                                system.maHeThongRap,
                                            )
                                        }
                                        className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border transition ${
                                            isActive
                                                ? "border-red-500 bg-red-600/20"
                                                : "border-white/10 bg-zinc-800 hover:border-red-500"
                                        }`}
                                        title={system.tenHeThongRap}
                                    >
                                        <ShowtimeVerifiedImg
                                            rawUrl={system.logo}
                                            alt={system.tenHeThongRap}
                                            className="h-10 w-10 object-contain"
                                            loading="lazy"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="min-h-0 min-w-0 w-full max-w-full overflow-x-hidden">
                    <div className={`${SHOWTIME_COLUMN_CLASS} flex flex-col p-4`}>
                        <header className="shrink-0 space-y-3 border-b border-white/10 pb-3">
                            <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
                                {!sortedShowingDateKeys.length && (
                                    <p className="px-1 py-2 text-sm text-zinc-500">
                                        No showtimes for this chain.
                                    </p>
                                )}
                                {sortedShowingDateKeys.map((dateKey) => {
                                    const dateObj = new Date(
                                        `${dateKey}T12:00:00`,
                                    );
                                    const isActive =
                                        dateKey === activeShowingDateKey;
                                    const weekdayLabel =
                                        WEEKDAY_LABELS_EN[dateObj.getDay()];
                                    const dayOfMonth = dateObj.getDate();
                                    const monthNum = dateObj.getMonth() + 1;

                                    return (
                                        <button
                                            key={dateKey}
                                            type="button"
                                            onClick={() =>
                                                setSelectedShowingDateKey(
                                                    dateKey,
                                                )
                                            }
                                            className={`flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-lg px-3 py-2 text-center transition ${
                                                isActive
                                                    ? "text-red-500"
                                                    : "text-zinc-300 hover:bg-zinc-800/80"
                                            }`}
                                        >
                                            <span className="text-xs font-medium leading-tight">
                                                {weekdayLabel}
                                            </span>
                                            <span
                                                className={`text-lg font-bold tabular-nums ${
                                                    isActive
                                                        ? "text-red-500"
                                                        : "text-white"
                                                }`}
                                            >
                                                {dayOfMonth}/{monthNum}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </header>

                        <div className="min-h-0 flex-1 overflow-hidden pt-3">
                            <div className="theater-scrollbar h-full overflow-y-auto overflow-x-hidden pr-1">
                                <div className="space-y-0 divide-y divide-white/10">
                                    {theaterClusters.map((cluster) => {
                                        const sessionsOnActiveDate =
                                            sessionsForDay(
                                                cluster.lichChieuPhim,
                                                activeShowingDateKey,
                                            );
                                        return (
                                            <article
                                                key={cluster.maCumRap}
                                                className="py-4 first:pt-0"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-800">
                                                        <ShowtimeVerifiedImg
                                                            key={`${cluster.maCumRap}-${activeTheaterSystemCode}`}
                                                            rawUrl={
                                                                cluster.hinhAnh
                                                            }
                                                            fallbackRawUrl={
                                                                activeTheaterSystem?.logo
                                                            }
                                                            alt={
                                                                cluster.tenCumRap
                                                            }
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="line-clamp-2 text-sm font-bold text-white">
                                                            {cluster.tenCumRap}
                                                        </h3>
                                                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                                                            {cluster.diaChi}{" "}
                                                            <a
                                                                href={googleMapsSearchUrl(
                                                                    cluster.diaChi,
                                                                )}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="font-semibold text-red-500 hover:underline"
                                                            >
                                                                [Map]
                                                            </a>
                                                        </p>

                                                        <div className="mt-3">
                                                            {sessionsOnActiveDate.length ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {sessionsOnActiveDate.map(
                                                                        (
                                                                            session,
                                                                        ) => (
                                                                            <NavLink
                                                                                key={
                                                                                    session.maLichChieu
                                                                                }
                                                                                to={`/ticketroom/${session.maLichChieu}`}
                                                                                className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                                                                            >
                                                                                {showtimeLabel(
                                                                                    session.ngayChieuGioChieu,
                                                                                )}
                                                                            </NavLink>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-zinc-500">
                                                                    No movie showtimes on this date.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}

                                    {!theaterClusters.length && (
                                        <p className="py-6 text-sm text-zinc-500">
                                            No clusters returned for this chain.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowtimeSection;

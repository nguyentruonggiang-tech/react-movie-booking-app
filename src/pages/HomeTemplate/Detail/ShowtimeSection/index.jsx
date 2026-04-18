import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearMovieShowtimes, fetchMovieShowtimes } from "./slice";

import ShowingDateStrip from "./_components/ShowingDateStrip";
import ShowtimeSectionSkeleton from "./_components/ShowtimeSectionSkeleton";
import TheaterClusterSessions from "./_components/TheaterClusterSessions";
import TheaterSystemRail from "./_components/TheaterSystemRail";
import ErrorBox from "@pages/HomeTemplate/_components/ErrorBox";
import NotFound from "@pages/HomeTemplate/_components/NotFound";
import { SHOWTIME_COLUMN_CLASS } from "./constants";
import { sortedDayKeys } from "./utils";

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

    const handleRetryShowtimes = useCallback(() => {
        if (!maPhim) return;
        dispatch(fetchMovieShowtimes(maPhim));
    }, [dispatch, maPhim]);

    const theaterSystems = useMemo(() => {
        const list = data?.heThongRapChieu;
        return Array.isArray(list) ? list : [];
    }, [data?.heThongRapChieu]);

    const fallbackSystemCode = theaterSystems[0]?.maHeThongRap ?? null;
    const activeTheaterSystemCode =
        selectedTheaterSystemCode &&
        theaterSystems.some((s) => s.maHeThongRap === selectedTheaterSystemCode)
            ? selectedTheaterSystemCode
            : fallbackSystemCode;

    const activeTheaterSystem =
        theaterSystems.find((s) => s.maHeThongRap === activeTheaterSystemCode) ??
        null;

    const theaterClusters = useMemo(() => {
        const clusters = activeTheaterSystem?.cumRapChieu;
        return Array.isArray(clusters) ? clusters : [];
    }, [activeTheaterSystem?.cumRapChieu]);

    const sortedShowingDateKeys = useMemo(
        () => sortedDayKeys(theaterClusters),
        [theaterClusters],
    );

    const activeShowingDateKey = useMemo(
        () =>
            sortedShowingDateKeys.find((k) => k === selectedShowingDateKey) ??
            sortedShowingDateKeys[0] ??
            null,
        [sortedShowingDateKeys, selectedShowingDateKey],
    );

    if (loading) return <ShowtimeSectionSkeleton />;

    if (error) {
        return (
            <ErrorBox
                title="Lịch chiếu"
                message={error}
                onRetry={handleRetryShowtimes}
            />
        );
    }

    if (!theaterSystems.length) {
        return (
            <NotFound
                title="Lịch chiếu"
                message="Hiện chưa có suất chiếu."
            />
        );
    }

    return (
        <section
            className="relative z-10 mx-auto mt-10 w-full min-w-0 max-w-7xl overflow-x-hidden px-8 pb-6 md:pb-8"
            aria-labelledby="movie-showtimes-heading"
        >
            <h2
                id="movie-showtimes-heading"
                className="mb-8 text-4xl font-black uppercase tracking-tight text-white"
            >
                Lịch chiếu
            </h2>

            <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[96px_minmax(0,1fr)] lg:items-stretch">
                <TheaterSystemRail
                    theaterSystems={theaterSystems}
                    activeTheaterSystemCode={activeTheaterSystemCode}
                    onSelectTheaterSystem={setSelectedTheaterSystemCode}
                />

                <div className="min-h-0 min-w-0 w-full max-w-full overflow-x-hidden">
                    <div
                        className={`${SHOWTIME_COLUMN_CLASS} flex flex-col p-4`}
                    >
                        <ShowingDateStrip
                            sortedShowingDateKeys={sortedShowingDateKeys}
                            activeShowingDateKey={activeShowingDateKey}
                            onSelectShowingDateKey={setSelectedShowingDateKey}
                        />

                        <TheaterClusterSessions
                            theaterClusters={theaterClusters}
                            activeShowingDateKey={activeShowingDateKey}
                            activeTheaterSystemCode={
                                activeTheaterSystem?.maHeThongRap
                            }
                            activeTheaterSystem={activeTheaterSystem}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowtimeSection;

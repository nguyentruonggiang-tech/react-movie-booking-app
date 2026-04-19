import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ErrorBox from "@pages/AdminTemplate/_components/ErrorBox";
import { formatDate, formatDateDisplay } from "@utils/dateUtils";
import {
    adminShowtimeSelectors,
    fetchAdminShowtimeMovie,
    fetchAdminShowtimePhimSchedule,
    resetAdminShowtimePage,
} from "./slice";
import { flattenScheduleRows, sessionMatchesDay } from "./utils";
import CreateShowtimeForm from "./_components/CreateShowtimeForm";
import DayScheduleList from "./_components/DayScheduleList";
import SelectedMovieCard from "./_components/SelectedMovieCard";
import ShowTimePageHeader from "./_components/ShowTimePageHeader";

export default function ShowTime() {
    const { idFilm } = useParams();
    const dispatch = useDispatch();

    const movieState = useSelector(adminShowtimeSelectors.movie);
    const scheduleState = useSelector(adminShowtimeSelectors.schedule);

    const [ngayChieu, setNgayChieu] = useState(() => formatDate(new Date()));

    useEffect(() => {
        if (!idFilm) return undefined;
        dispatch(fetchAdminShowtimeMovie(idFilm));
        return () => {
            dispatch(resetAdminShowtimePage());
        };
    }, [dispatch, idFilm]);

    const movie = movieState.data;
    const maPhimApi = movie?.maPhim ?? idFilm;

    useEffect(() => {
        const id = String(maPhimApi ?? "").trim();
        if (!id || !movie) return;
        dispatch(fetchAdminShowtimePhimSchedule(id));
    }, [dispatch, movie, maPhimApi]);

    const sessionsForSelectedDay = useMemo(() => {
        const dayKey = String(ngayChieu ?? "").trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey) || !scheduleState.raw) return [];
        const rows = flattenScheduleRows(scheduleState.raw).filter((row) =>
            sessionMatchesDay(row.session, dayKey),
        );
        return [...rows].sort((a, b) => {
            const ta = new Date(a.session?.ngayChieuGioChieu ?? 0).getTime();
            const tb = new Date(b.session?.ngayChieuGioChieu ?? 0).getTime();
            return ta - tb;
        });
    }, [ngayChieu, scheduleState.raw]);

    const selectedDayLabel = useMemo(() => {
        const d = String(ngayChieu ?? "").trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return "—";
        return formatDateDisplay(d) || d;
    }, [ngayChieu]);

    if (movieState.loading && !movie) {
        return (
            <div className="mx-auto max-w-6xl animate-pulse space-y-4 px-1">
                <div className="h-8 w-64 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-72 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            </div>
        );
    }

    if (movieState.error) {
        return (
            <div className="mx-auto max-w-2xl">
                <ErrorBox
                    title="Không tải được phim"
                    message={movieState.error}
                    onRetry={() => idFilm && dispatch(fetchAdminShowtimeMovie(idFilm))}
                    backHref="/admin/films"
                    backLabel="Danh sách phim"
                />
            </div>
        );
    }

    const editFilmHref = `/admin/films/edit/${maPhimApi}`;

    return (
        <div className="mx-auto max-w-6xl px-1 pb-8">
            <ShowTimePageHeader />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
                <CreateShowtimeForm ngayChieu={ngayChieu} onNgayChieuChange={setNgayChieu} />

                <div className="flex min-w-0 flex-col gap-6">
                    <SelectedMovieCard movie={movie} editHref={editFilmHref} />

                    {movie ? (
                        <DayScheduleList
                            ngayChieu={ngayChieu}
                            scheduleLoading={scheduleState.loading}
                            scheduleError={scheduleState.error}
                            sessionsForSelectedDay={sessionsForSelectedDay}
                            selectedDayLabel={selectedDayLabel}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

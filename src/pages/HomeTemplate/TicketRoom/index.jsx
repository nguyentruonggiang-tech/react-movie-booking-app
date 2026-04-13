import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useParams } from "react-router-dom";
import SeatMap from "./_components/SeatMap";
import TicketRoomSummary from "./_components/TicketRoomSummary";
import { clearTicketRoom, fetchTicketRoom } from "./slice";
import ErrorBox from "@pages/HomeTemplate/_components/ErrorBox";
import NotFound from "@pages/HomeTemplate/_components/NotFound";

function Breadcrumb({ film, detailMaPhim }) {
    const linkClass =
        "rounded-sm font-medium text-slate-200 underline decoration-transparent underline-offset-[3px] transition-colors duration-200 hover:text-red-600 hover:decoration-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/70";

    return (
        <nav
            aria-label="Breadcrumb"
            className="mb-6 border-b border-white/10 pb-4 text-sm text-zinc-300"
        >
            <ol className="flex min-w-0 flex-wrap items-center gap-2">
                <li>
                    <NavLink to="/" className={linkClass}>
                        Home
                    </NavLink>
                </li>

                {film?.tenPhim ? (
                    <>
                        <li className="text-zinc-500" aria-hidden>
                            |
                        </li>
                        <li className="min-w-0 max-w-[min(100%,20rem)] sm:max-w-md">
                            {detailMaPhim ? (
                                <NavLink
                                    to={`/detail/${detailMaPhim}`}
                                    className={`${linkClass} block truncate`}
                                >
                                    {film.tenPhim}
                                </NavLink>
                            ) : (
                                <span className="block truncate font-medium text-zinc-400">
                                    {film.tenPhim}
                                </span>
                            )}
                        </li>
                    </>
                ) : null}

                <li className="text-zinc-500" aria-hidden>
                    |
                </li>
                <li>
                    <span aria-current="page" className="font-medium text-white/90">
                        Select tickets
                    </span>
                </li>
            </ol>
        </nav>
    );
}

function SeatMapSkeleton() {
    return (
        <div
            className="flex min-h-[320px] items-center justify-center"
            role="status"
        >
            <div className="flex flex-col gap-4 items-center w-full max-w-[760px]">

                <div className="flex gap-4 mb-2">
                    <span className="inline-block min-w-9 h-6" />
                    <div className="flex gap-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={`header-${i}`}
                                className="h-6 w-9 rounded bg-zinc-700/40 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
                {Array.from({ length: 5 }).map((_, rowIdx) => (
                    <div className="flex gap-4" key={`row-${rowIdx}`}>
                        <span className="inline-block min-w-9 h-9 rounded bg-yellow-100/5" />
                        <div className="flex gap-2">
                            {Array.from({ length: 10 }).map((_, seatIdx) => (
                                <div
                                    key={`seat-${rowIdx}-${seatIdx}`}
                                    className="h-9 w-9 rounded-md bg-zinc-600/60 animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                ))}
                <div className="flex gap-6 mt-6 w-full justify-center">
                    <div className="h-6 w-28 rounded bg-zinc-700/40 animate-pulse" />
                    <div className="h-6 w-20 rounded bg-zinc-700/40 animate-pulse" />
                    <div className="h-6 w-28 rounded bg-zinc-700/40 animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default function TicketRoom() {
    const { maLichChieu } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();

    const { data, loading, error } = useSelector(
        (state) => state.ticketRoomReducer,
    );

    useEffect(() => {
        dispatch(fetchTicketRoom(maLichChieu));

        return () => {
            dispatch(clearTicketRoom());
        };
    }, [dispatch, maLichChieu]);

    let film = data?.thongTinPhim;
    const stateMaPhim = location.state?.maPhim;

    const detailMaPhim =
        film?.maPhim != null && String(film.maPhim).trim() !== ""
            ? String(film.maPhim)
            : stateMaPhim != null && String(stateMaPhim).trim() !== ""
              ? String(stateMaPhim)
              : null;

    return (
        <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-[#1a1a2e] to-[#16213e] px-4 py-8 text-gray-200">
            <div className="mx-auto max-w-[1200px]">
                <Breadcrumb film={film} detailMaPhim={detailMaPhim} />

                {loading && <SeatMapSkeleton />}

                {!loading && error && <ErrorBox 
                    title="Could not load ticket room"
                    message={error}
                    onRetry={() => dispatch(fetchTicketRoom(maLichChieu))} 
                />}

                {!loading && !error && !film && <NotFound 
                    title="Movie not found" 
                    message="No movie data was returned for this id." 
                    onRetry={() => dispatch(fetchTicketRoom(maLichChieu))} 
                />}

                {!loading && !error && film && (
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
                        <div className="flex min-w-0 flex-1 justify-center">
                            <SeatMap seatRows={data?.seatRows} readOnly />
                        </div>

                        <aside className="w-full lg:sticky lg:top-24 lg:max-w-[420px]">
                            <TicketRoomSummary film={film} />
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
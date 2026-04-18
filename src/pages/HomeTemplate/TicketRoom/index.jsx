import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useParams } from "react-router-dom";
import SeatMap from "./_components/SeatMap";
import TicketRoomSummary from "./_components/TicketRoomSummary";
import {
    clearBookingFeedback,
    clearTicketRoom,
    fetchTicketRoom,
    toggleSeat,
} from "./slice";
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
                        Trang chủ
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
                        Chọn vé
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

function mergeSelectedIntoSeatRows(seatRows, selectedSeats) {
    if (!Array.isArray(seatRows) || seatRows.length === 0) {
        return seatRows;
    }

    const selectedSeatIds = new Set(
        selectedSeats.map((selectedSeat) =>
            String(selectedSeat?.maGhe ?? ""),
        ),
    );

    return seatRows.map((row) => ({
        ...row,
        danhSachGhe: row.danhSachGhe.map((seat) => ({
            ...seat,
            dangChon: selectedSeatIds.has(String(seat?.maGhe ?? "")),
        })),
    }));
}

export default function TicketRoom() {
    const { maLichChieu } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();

    const { data, loading, error, selectedSeats } = useSelector(
        (state) => state.ticketRoomReducer.seatMap,
    );

    const seatRowsForMap = useMemo(
        () => mergeSelectedIntoSeatRows(data?.seatRows, selectedSeats),
        [data?.seatRows, selectedSeats],
    );

    const handleToggleSeat = useCallback(
        (seat) => {
            dispatch(toggleSeat(seat));
            dispatch(clearBookingFeedback());
        },
        [dispatch],
    );

    const handleBookingSuccess = useCallback(() => {
        dispatch(fetchTicketRoom(maLichChieu));
    }, [dispatch, maLichChieu]);

    useEffect(() => {
        dispatch(fetchTicketRoom(maLichChieu));

        return () => {
            dispatch(clearTicketRoom());
            dispatch(clearBookingFeedback());
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
                    title="Không tải được phòng vé"
                    message={error}
                    onRetry={() => dispatch(fetchTicketRoom(maLichChieu))} 
                />}

                {!loading && !error && !film && <NotFound 
                    title="Không tìm thấy phim"
                    message="Không có dữ liệu phim cho mã này."
                />}

                {!loading && !error && film && (
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
                        <div className="flex min-h-0 min-w-0 flex-1 justify-center">
                            <SeatMap
                                seatRows={seatRowsForMap}
                                readOnly={false}
                                onToggleSeat={handleToggleSeat}
                            />
                        </div>

                        <aside className="flex w-full min-h-0 max-h-[calc(100dvh-10rem)] flex-col overflow-hidden self-start lg:sticky lg:top-24 lg:max-h-[calc(100dvh-9rem)] lg:max-w-[420px]">
                            <TicketRoomSummary
                                film={film}
                                maLichChieu={maLichChieu}
                                onBookingSuccess={handleBookingSuccess}
                            />
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
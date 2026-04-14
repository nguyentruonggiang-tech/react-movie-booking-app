import { TicketIcon } from "@pages/HomeTemplate/_components/icons";
import { BOOKING_CTA } from "@pages/HomeTemplate/constants";
import { useDispatch, useSelector } from "react-redux";
import { removeSeat } from "../slice";
import { getSeatLabel, getSeatRowSubtitle } from "../seatDisplay";
import { isVipSeat } from "../seatStyles";

function formatPriceVnd(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(amount);
}

function SummaryInfoItem({ label, value }) {
    return (
        <div className="rounded-lg bg-black/20 px-3 py-2 ring-1 ring-white/10">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
                {label}
            </dt>
            <dd className="mt-0.5 text-xs font-medium leading-snug text-white/75">
                {value}
            </dd>
        </div>
    );
}

function SelectedSeatTable() {
    const dispatch = useDispatch();
    const selectedSeats = useSelector(
        (state) => state.ticketRoomReducer.selectedSeats,
    );

    const total = selectedSeats.reduce(
        (sum, selectedSeat) =>
            sum + (Number(selectedSeat.gia) || 0),
        0,
    );

    const selectedTicketCount = selectedSeats.length;
    const ticketsLabel =
        selectedTicketCount === 1 ? "ticket" : "tickets";

    return (
        <div className="flex min-h-0 flex-1 flex-col pt-5">
            <div className="mb-2 flex min-h-[2rem] shrink-0 flex-wrap items-center justify-between gap-2">
                <h3 className="text-[0.95rem] font-bold tracking-wide text-amber-400">
                    Selected seats
                </h3>
                <span
                    className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-amber-200/95 tabular-nums"
                    aria-live="polite"
                    aria-label={`${selectedTicketCount} ${ticketsLabel} selected`}
                >
                    {selectedTicketCount} {ticketsLabel}
                </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950/40 ring-1 ring-white/5">
                <div className="shrink-0 border-b border-white/10 px-3 py-2">
                    {/* Same horizontal inset as each seat row (`li` px-2 sm:px-3) so column titles line up */}
                    <div className="px-2 sm:px-3">
                        <div className="grid grid-cols-[4.25rem_minmax(0,1fr)_7.5rem_2.25rem] items-center gap-x-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                            <span className="text-left">Type</span>
                            <span className="min-w-0 -translate-x-px ps-0">
                                Seat
                            </span>
                            <span className="text-right tabular-nums">Price</span>
                            <span className="w-9 shrink-0" aria-hidden="true" />
                        </div>
                    </div>
                </div>

                <div className="theater-scrollbar max-h-[28rem] min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
                    {selectedSeats.length === 0 ? (
                        <div className="flex min-h-[5rem] items-center justify-center px-3 py-6 text-center text-sm text-white/45">
                            No seats selected yet.
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-1.5">
                            {selectedSeats.map((selectedSeat) => {
                                const seatId = selectedSeat.maGhe;
                                const primaryLabel = getSeatLabel(selectedSeat);
                                const rowSubtitle = getSeatRowSubtitle(selectedSeat);
                                const ticketPrice =
                                    Number(selectedSeat.gia) || 0;
                                const isVip = isVipSeat(selectedSeat);
                                const seatAriaLabel = [
                                    "Seat",
                                    primaryLabel,
                                    rowSubtitle,
                                    isVip ? "VIP" : "",
                                ]
                                    .filter(Boolean)
                                    .join(", ");

                                return (
                                    <li
                                        key={String(seatId ?? primaryLabel)}
                                        className={`grid grid-cols-[4.25rem_minmax(0,1fr)_7.5rem_2.25rem] items-center gap-x-2 rounded-lg border px-2 py-2 transition-colors sm:px-3 ${
                                            isVip
                                                ? "border-amber-500/35 bg-gradient-to-r from-amber-950/45 via-amber-950/15 to-white/[0.03] ring-1 ring-inset ring-amber-400/20 hover:border-amber-400/50 hover:from-amber-950/55 hover:ring-amber-300/25"
                                                : "border-white/[0.06] bg-white/[0.04] hover:border-white/10 hover:bg-white/[0.06]"
                                        }`}
                                        aria-label={seatAriaLabel}
                                    >
                                        <div className="flex min-h-[2.25rem] items-center justify-start">
                                            {isVip ? (
                                                <span className="inline-flex items-center justify-center rounded-md border border-amber-400/70 bg-gradient-to-b from-amber-300/35 to-amber-800/45 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-50 shadow-[0_0_14px_rgba(251,191,36,0.28)]">
                                                    VIP
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="min-w-0 -translate-x-px ps-0">
                                            <p className="truncate text-sm leading-snug text-white/90">
                                                <span
                                                    className={`font-semibold ${
                                                        isVip
                                                            ? "text-amber-100"
                                                            : "text-amber-200"
                                                    }`}
                                                >
                                                    {primaryLabel}
                                                </span>
                                                {rowSubtitle ? (
                                                    <span className="font-normal text-white/45">
                                                        {" "}
                                                        · {rowSubtitle}
                                                    </span>
                                                ) : null}
                                            </p>
                                        </div>
                                        <div className="text-right text-sm font-semibold tabular-nums text-amber-200/95">
                                            {formatPriceVnd(ticketPrice)}
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    dispatch(
                                                        removeSeat({
                                                            maGhe:
                                                                selectedSeat.maGhe,
                                                            soGhe:
                                                                selectedSeat.soGhe,
                                                        }),
                                                    );
                                                }}
                                                className="relative z-10 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-red-500/75 bg-gradient-to-b from-red-500/30 to-red-700/25 font-bold leading-none text-red-50 shadow-[0_0_14px_rgba(239,68,68,0.45)] ring-1 ring-inset ring-red-300/25 transition-all hover:border-red-400 hover:from-red-500/45 hover:to-red-600/35 hover:shadow-[0_0_20px_rgba(248,113,113,0.55)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                                                title="Remove seat"
                                            >
                                                <span
                                                    className="text-2xl leading-none"
                                                    aria-hidden
                                                >
                                                    ×
                                                </span>
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="shrink-0 border-t border-white/10 bg-black/25 px-3 py-2.5">
                    <div className="px-2 sm:px-3">
                        <div className="grid grid-cols-[4.25rem_minmax(0,1fr)_7.5rem_2.25rem] items-center gap-x-2">
                            <span className="min-w-0" aria-hidden="true" />
                            <span className="min-w-0 -translate-x-px ps-0 text-sm font-bold text-white">
                                Total
                            </span>
                            <span className="text-right text-sm font-bold tabular-nums text-[#FB897E]">
                                {formatPriceVnd(total)}
                            </span>
                            <span className="w-9 shrink-0" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TicketRoomSummary({ film }) {
    const selectedSeats = useSelector(
        (state) => state.ticketRoomReducer.selectedSeats,
    );
    const hasSelectedSeats = selectedSeats.length > 0;

    return (
        <div className="flex h-full max-h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-xl backdrop-blur-sm">
            <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-44">
                <img
                    src={film.hinhAnh}
                    alt={film.tenPhim}
                    className="h-full w-full object-cover object-[50%_15%]"
                />
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/25"
                    aria-hidden
                />
                <div className="absolute left-4 top-4 z-10">
                    <span className="inline-block rounded-md border border-[#E85A4A]/50 bg-gradient-to-b from-[#FF9B8F] to-[#FB7A6E] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-900 shadow-[0_2px_12px_rgba(251,137,126,0.45)]">
                        Selecting tickets
                    </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-3 pt-10">
                    <h2 className="text-lg font-bold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-xl">
                        {film.tenPhim}
                    </h2>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col border-t border-white/10">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
                    <dl className="shrink-0 space-y-3">
                        <div className="rounded-lg bg-black/25 px-3 py-3 ring-1 ring-white/10">
                            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/45">
                                Cinema
                            </dt>
                            <dd className="mt-1.5 text-lg font-semibold leading-snug text-white sm:text-xl">
                                {film.tenCumRap}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                            <SummaryInfoItem
                                label="Showtime"
                                value={`${film.gioChieu} · ${film.ngayChieu}`}
                            />
                            <SummaryInfoItem
                                label="Auditorium"
                                value={film.tenRap}
                            />
                        </div>
                    </dl>

                    <SelectedSeatTable />
                </div>

                <div className="shrink-0 border-t border-white/10 bg-zinc-950/80 p-4 pt-3 backdrop-blur-sm">
                    <button
                        type="button"
                        disabled={!hasSelectedSeats}
                        title={
                            hasSelectedSeats
                                ? "Book tickets for selected seats"
                                : "Select at least one seat to continue"
                        }
                        className={`inline-flex w-full items-center justify-center gap-2 border-none px-8 py-4 text-sm ${BOOKING_CTA} disabled:cursor-not-allowed disabled:opacity-50 disabled:saturate-90`}
                    >
                        <TicketIcon className="h-6 w-6 shrink-0 text-white" />
                        Book tickets
                    </button>
                </div>
            </div>
        </div>
    );
}
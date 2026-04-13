import { TicketIcon } from "@pages/HomeTemplate/_components/icons";
import { BOOKING_CTA } from "@pages/HomeTemplate/constants";
import { MOCK_SELECTED_SEATS } from "../mockSelectedSeats";

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
    const total = MOCK_SELECTED_SEATS.reduce((sum, seat) => sum + seat.gia, 0);

    return (
        <div className="mt-5">
            <div className="mb-2 flex min-h-[2rem] flex-wrap items-center justify-between gap-2">
                <h3 className="text-[0.95rem] font-bold tracking-wide text-amber-400">
                    Selected seats
                </h3>
                <span className="rounded border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300/90">
                    Mockup
                </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/15">
                <table className="w-full table-fixed border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="border border-white/15 bg-zinc-900/95 px-3 py-2.5 text-left font-bold text-amber-400">
                                Seat
                            </th>
                            <th className="border border-white/15 bg-zinc-900/95 px-3 py-2.5 text-right font-bold text-amber-400">
                                Price
                            </th>
                            <th className="w-16 border border-white/15 bg-zinc-900/95 px-2 py-2.5 text-center font-bold text-amber-400">
                                Remove
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_SELECTED_SEATS.map((seat) => (
                            <tr
                                key={seat.soGhe}
                                className="bg-white/[0.03] hover:bg-white/[0.06]"
                            >
                                <td className="border border-white/15 px-3 py-2.5 font-semibold text-amber-300">
                                    {seat.soGhe}
                                </td>
                                <td className="border border-white/15 px-3 py-2.5 text-right font-semibold whitespace-nowrap text-amber-300">
                                    {formatPriceVnd(seat.gia)}
                                </td>
                                <td className="border border-white/15 px-2 py-2 text-center">
                                    <button
                                        type="button"
                                        disabled
                                        className="inline-flex min-h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-md border border-red-500/50 bg-red-500/15 px-2 text-lg font-bold leading-none text-red-200/90"
                                        title="Demo data"
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}

                        <tr className="bg-black/20">
                            <td className="border border-white/15 px-3 py-3 font-bold text-white">
                                Total
                            </td>
                            <td className="border border-white/15 px-3 py-3 text-right text-base font-bold whitespace-nowrap text-[#FB897E]">
                                {formatPriceVnd(total)}
                            </td>
                            <td className="border border-white/15 bg-black/10" />
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function TicketRoomSummary({ film }) {
    return (
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-xl backdrop-blur-sm">
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

            <div className="flex flex-1 flex-col border-t border-white/10">
                <div className="theater-scrollbar flex-1 overflow-y-auto p-4">
                    <dl className="space-y-3">
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
                        disabled
                        title="Step 3 — book tickets"
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
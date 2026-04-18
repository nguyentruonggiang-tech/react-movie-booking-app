import ProfileBookingCard from "./ProfileBookingCard";
import { ticketsNewestFirst } from "../bookingFormat";

const bookingListMaxHeight = "min(85vh, 54rem)";

export default function ProfileBookingHistory({ tickets }) {
    const danhSachVe = ticketsNewestFirst(tickets);

    if (danhSachVe.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-10 text-center">
                <p className="text-lg font-semibold text-zinc-200">
                    No bookings yet
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                    After you book a showtime, your tickets will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-col gap-4">
            <div className="shrink-0 border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                    Booking history
                </h2>
            </div>
            <div
                className="profile-booking-scrollbar min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]"
                style={{ maxHeight: bookingListMaxHeight }}
                tabIndex={0}
                role="region"
                aria-label="Booked tickets list"
            >
                <ul className="space-y-4 pb-2">
                    {danhSachVe.map((ticket) => {
                        const key =
                            ticket?.maVe != null
                                ? `ve-${ticket.maVe}`
                                : `ve-${ticket?.ngayDat}-${ticket?.tenPhim}`;
                        return (
                            <li key={key}>
                                <ProfileBookingCard ticket={ticket} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

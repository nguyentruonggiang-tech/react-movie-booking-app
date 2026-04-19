import ProfileBookingCard from "./ProfileBookingCard";
import { ticketsNewestFirst } from "../bookingFormat";

const bookingListMaxHeight = "min(85vh, 54rem)";

export default function ProfileBookingHistory({ tickets }) {
    const danhSachVe = ticketsNewestFirst(tickets);

    if (danhSachVe.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
                <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                    Chưa có vé đã đặt
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-500">
                    Sau khi bạn đặt vé, danh sách sẽ hiển thị tại đây.
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-col gap-4">
            <div className="shrink-0 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Lịch sử đặt vé
                </h2>
            </div>
            <div
                className="profile-booking-scrollbar min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]"
                style={{ maxHeight: bookingListMaxHeight }}
                tabIndex={0}
                role="region"
                aria-label="Danh sách vé đã đặt"
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

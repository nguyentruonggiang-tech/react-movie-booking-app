import { MapPin, VideoCamera } from "flowbite-react-icons/outline";
import {
    bookingTimeText,
    firstSeatRow,
    seatNamesLine,
    ticketPriceText,
} from "../bookingFormat";

function InfoCell({ label, value }) {
    return (
        <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {value}
            </p>
        </div>
    );
}

export default function ProfileBookingCard({ ticket }) {
    const gheDau = firstSeatRow(ticket);
    const tenHeThong = String(gheDau?.tenHeThongRap ?? "").trim() || "—";
    const tenCum = String(gheDau?.tenCumRap ?? "").trim() || "—";
    const tenPhim = String(ticket?.tenPhim ?? "").trim() || "—";
    const posterUrl = String(ticket?.hinhAnh ?? "").trim();
    const ngayDat = ticket?.ngayDat;
    const giaHienThi = ticketPriceText(ticket?.giaVe);
    const phutPhim =
        ticket?.thoiLuongPhim != null && Number.isFinite(Number(ticket.thoiLuongPhim))
            ? `${Number(ticket.thoiLuongPhim)} phút`
            : "—";

    return (
        <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-black/20">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
                <div className="relative mx-auto w-full max-w-[140px] shrink-0 sm:mx-0 sm:w-36">
                    <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        {posterUrl ? (
                            <img
                                src={posterUrl}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                                —
                            </div>
                        )}
                    </div>
                </div>

                <div className="min-w-0 flex-1 space-y-4">
                    <div>
                        <h3 className="text-lg font-bold leading-snug text-zinc-900 sm:text-xl dark:text-white">
                            {tenPhim}
                        </h3>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="text-zinc-500">Giá vé:</span>{" "}
                            <span className="text-zinc-900 dark:text-zinc-200">
                                {giaHienThi}
                            </span>
                            <span className="mx-2 text-zinc-400 dark:text-zinc-600" aria-hidden>
                                |
                            </span>
                            <span className="text-zinc-500">Thời lượng:</span>{" "}
                            <span className="text-zinc-900 dark:text-zinc-200">
                                {phutPhim}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <p className="flex items-start gap-2">
                            <VideoCamera
                                className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                                aria-hidden
                            />
                            <span>
                                <span className="text-zinc-500">Hệ thống rạp:</span>{" "}
                                <span className="text-zinc-900 dark:text-zinc-200">
                                    {tenHeThong}
                                </span>
                            </span>
                        </p>
                        <p className="flex items-start gap-2">
                            <MapPin
                                className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                                aria-hidden
                            />
                            <span>
                                <span className="text-zinc-500">Cụm rạp:</span>{" "}
                                <span className="text-zinc-900 dark:text-zinc-200">
                                    {tenCum}
                                </span>
                            </span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800/80 sm:grid-cols-2">
                        <InfoCell label="Đặt lúc" value={bookingTimeText(ngayDat)} />
                        <InfoCell label="Ghế" value={seatNamesLine(ticket)} />
                    </div>
                </div>
            </div>
        </article>
    );
}

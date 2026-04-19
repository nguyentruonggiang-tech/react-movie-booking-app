import { NavLink } from "react-router-dom";

function formatShowtime(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

const chipClassName =
    "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold tabular-nums text-slate-800 shadow-sm " +
    "dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-none";

export default function ShowtimeItem({ showtime }) {
    const label = formatShowtime(showtime?.ngayChieuGioChieu);
    const maLichChieu = showtime?.maLichChieu;
    const ticketTo =
        maLichChieu != null && String(maLichChieu).trim() !== ""
            ? `/ticketroom/${maLichChieu}`
            : null;

    if (ticketTo) {
        return (
            <NavLink
                to={ticketTo}
                className={`${chipClassName} inline-block transition hover:border-red-500 hover:bg-red-50 hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:hover:border-red-500/60 dark:hover:bg-red-950/40 dark:hover:text-white`}
            >
                {label}
            </NavLink>
        );
    }

    return <span className={chipClassName}>{label}</span>;
}
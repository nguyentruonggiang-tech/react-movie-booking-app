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
    "rounded-md border border-white/15 bg-zinc-900 px-3 py-1.5 text-sm font-semibold tabular-nums text-zinc-200";

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
                className={`${chipClassName} inline-block transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500`}
            >
                {label}
            </NavLink>
        );
    }

    return <span className={chipClassName}>{label}</span>;
}
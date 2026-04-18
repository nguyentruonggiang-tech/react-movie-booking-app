export function seatsFromTicket(ticket) {
    const list = ticket?.danhSachGhe;
    if (!Array.isArray(list) || list.length === 0) return [];
    return list;
}

export function firstSeatRow(ticket) {
    const seats = seatsFromTicket(ticket);
    return seats[0] ?? null;
}

export function seatNamesLine(ticket) {
    const seats = seatsFromTicket(ticket);
    if (seats.length === 0) return "—";
    const names = seats.map((g) => String(g?.tenGhe ?? "").trim()).filter(Boolean);
    if (names.length === 0) return "—";
    return names.join(", ");
}

export function bookingTimeText(ngayDat) {
    const d = ngayDat ? new Date(ngayDat) : null;
    if (!d || Number.isNaN(d.getTime())) return "—";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${hh}:${mm} ${dd}/${mo}/${yyyy}`;
}

export function ticketPriceText(giaVe) {
    const n = Number(giaVe);
    if (!Number.isFinite(n)) return "—";
    return `${new Intl.NumberFormat("en-US").format(n)} VND`;
}

export function ticketsNewestFirst(tickets) {
    if (!Array.isArray(tickets)) return [];
    return [...tickets].sort((a, b) => {
        const ta = a?.ngayDat ? new Date(a.ngayDat).getTime() : 0;
        const tb = b?.ngayDat ? new Date(b.ngayDat).getTime() : 0;
        return tb - ta;
    });
}

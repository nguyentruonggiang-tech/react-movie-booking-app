export function getSeatLabel(seat) {
    if (seat?.tenGhe != null && String(seat.tenGhe).trim() !== "") {
        return String(seat.tenGhe);
    }

    if (typeof seat?.soGhe === "string") {
        return seat.soGhe;
    }

    return "";
}

/** Secondary line under the main label (row index from seat map). */
export function getSeatRowSubtitle(seat) {
    const row = seat?.row;
    if (row == null || String(row).trim() === "") {
        return "";
    }
    return `Row ${row}`;
}

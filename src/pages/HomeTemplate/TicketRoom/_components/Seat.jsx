import {
    getSeatCellClassName,
    SEAT_COLUMN_HEADER_CLASS,
} from "../seatStyles";

export default function Seat({ ghe, row, readOnly = false }) {
    const isColumnHeaderRow = row === "";
    const daDat = ghe.daDat === true;
    const daCoNguoiChon = ghe.daCoNguoiChon === true;
    const dangChon = ghe.dangChon === true;
    const isSelectableSeat = !daDat && !daCoNguoiChon && ghe.gia > 0;

    if (isColumnHeaderRow) {
        return (
            <button
                type="button"
                className={SEAT_COLUMN_HEADER_CLASS}
                disabled
            >
                {ghe.soGhe}
            </button>
        );
    }

    const seatLabel =
        ghe.tenGhe != null && String(ghe.tenGhe).length > 0
            ? String(ghe.tenGhe)
            : typeof ghe.soGhe === "string"
              ? ghe.soGhe.replace(/^[A-Za-z]/i, "") || ghe.soGhe
              : ghe.soGhe;

    const className = getSeatCellClassName(ghe);

    let displayLabel = seatLabel;
    if (daDat) {
        displayLabel = "X";
    }

    return (
        <button
            type="button"
            className={className}
            disabled={daDat || daCoNguoiChon}
            aria-disabled={readOnly && isSelectableSeat ? true : undefined}
            tabIndex={readOnly && isSelectableSeat ? -1 : undefined}
            onClick={(event) => {
                if (readOnly) {
                    event.preventDefault();
                }
            }}
            aria-label={`Ghế ${ghe.soGhe}${
                daDat
                    ? ", đã đặt"
                    : daCoNguoiChon
                      ? ", đang được người khác giữ"
                      : dangChon
                        ? ", đã chọn"
                        : readOnly
                          ? " (chỉ xem)"
                          : ""
            }`}
        >
            {displayLabel}
        </button>
    );
}

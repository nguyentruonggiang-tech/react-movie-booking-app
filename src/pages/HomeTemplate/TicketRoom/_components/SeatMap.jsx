import {
    getSeatCellClassName,
    SEAT_COLUMN_HEADER_CLASS,
    SEAT_LEGEND_ITEMS,
} from "../seatStyles";

function getSeatLabel(ghe) {
    if (ghe?.tenGhe != null && String(ghe.tenGhe).trim() !== "") {
        return String(ghe.tenGhe);
    }

    if (typeof ghe?.soGhe === "string") {
        return ghe.soGhe;
    }

    return "";
}

function SeatItem({ ghe, row, readOnly }) {
    const isHeader = row === "";

    if (isHeader) {
        return (
            <button
                type="button"
                disabled
                className={SEAT_COLUMN_HEADER_CLASS}
            >
                {ghe.soGhe}
            </button>
        );
    }

    const daDat = ghe?.daDat === true;
    const daCoNguoiChon = ghe?.daCoNguoiChon === true;
    const displayLabel = daDat ? "X" : getSeatLabel(ghe);

    return (
        <button
            type="button"
            disabled={daDat || daCoNguoiChon}
            className={getSeatCellClassName(ghe)}
            aria-disabled={readOnly ? true : undefined}
            tabIndex={readOnly ? -1 : undefined}
            onClick={(event) => {
                if (readOnly) {
                    event.preventDefault();
                }
            }}
            aria-label={`Seat ${ghe.soGhe || ghe.tenGhe || ""}`}
        >
            {displayLabel}
        </button>
    );
}

function SeatRow({ seatRow, readOnly }) {
    return (
        <div className="mb-4 flex w-max max-w-full flex-nowrap items-center gap-4">
            {seatRow.row ? (
                <span className="min-w-9 shrink-0 text-center text-xl font-bold text-yellow-400 tabular-nums">
                    {seatRow.row}
                </span>
            ) : (
                <span className="inline-block min-w-9 shrink-0" />
            )}

            {seatRow.danhSachGhe.map((ghe) => (
                <SeatItem
                    key={ghe.maGhe ?? ghe.soGhe}
                    ghe={ghe}
                    row={seatRow.row}
                    readOnly={readOnly}
                />
            ))}
        </div>
    );
}

function Screen() {
    return (
        <div className="mx-auto mb-5 w-full max-w-[760px] text-center">
            <div className="relative mx-auto max-w-[min(100%,640px)] rounded-sm bg-gradient-to-b from-zinc-600/40 to-zinc-800/30 px-6 py-2 text-xs text-white/40 text-center">
                SCREEN
            </div>
            <div className="screen-triangle" />
        </div>
    );
}

function Legend() {
    return (
        <div
            className="mx-auto mt-0 flex w-full max-w-[760px] flex-wrap justify-center gap-x-6 gap-y-3 px-2 sm:gap-x-8"
            aria-label="Seat legend"
        >
            {SEAT_LEGEND_ITEMS.map((item) => (
                <div key={item.key} className="flex items-center gap-2.5 text-sm">
                    <span
                        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center ${item.boxClass}`}
                    >
                        {item.symbol ?? null}
                    </span>
                    <span className="text-white/85">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

/** Body rows visible before scroll (seat row height 38px + mb-4 gap). */
const SEAT_BODY_VISIBLE_ROW_COUNT = 10;
const SEAT_BODY_SCROLL_MAX = "max-h-[calc(10.4*(2.375rem+1rem))]";

export default function SeatMap({ seatRows, readOnly = true }) {
    if (!seatRows?.length) {
        return null;
    }

    const headerRow = seatRows.find((row) => row.row === "");
    const bodyRows = seatRows.filter((row) => row.row !== "");
    const needsScrollHint = bodyRows.length > SEAT_BODY_VISIBLE_ROW_COUNT;

    return (
        <div className="flex w-full flex-col items-center">
            <Screen />

            <div className="mx-auto flex w-full max-w-[760px] flex-col items-center">
                {headerRow ? (
                    <div className="flex w-full shrink-0 justify-center">
                        <SeatRow seatRow={headerRow} readOnly={readOnly} />
                    </div>
                ) : null}

                <div
                    className={`relative w-full ${needsScrollHint ? "mb-10" : ""}`}
                >
                    <div
                        className={`theater-scrollbar flex w-full flex-col items-center ${SEAT_BODY_SCROLL_MAX} overflow-y-auto overflow-x-auto overscroll-contain px-1 sm:px-0 ${needsScrollHint ? "scroll-pb-14 pb-14" : ""}`}
                    >
                        {bodyRows.map((seatRow) => (
                            <SeatRow
                                key={seatRow.row}
                                seatRow={seatRow}
                                readOnly={readOnly}
                            />
                        ))}
                    </div>

                    {needsScrollHint ? (
                        <div
                            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-5 flex-col items-center gap-0.5"
                            aria-hidden
                        >
                            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-zinc-950/95 px-3 py-1 text-xs font-semibold tracking-wide text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.35)] backdrop-blur-sm">
                                Scroll for more rows
                            </span>
                            <svg
                                className="h-4 w-4 text-amber-300 motion-safe:animate-bounce"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden
                            >
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    ) : null}
                </div>
            </div>

            <Legend />
        </div>
    );
}
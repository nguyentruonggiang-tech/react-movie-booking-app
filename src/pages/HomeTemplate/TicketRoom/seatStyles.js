export const SEAT_CELL_BASE =
    "inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md text-[15px] font-bold transition-colors";

export const SEAT_COLUMN_HEADER_CLASS =
    "m-0 h-[38px] w-[38px] shrink-0 border-none bg-transparent text-xl font-bold text-amber-400/95";

export const SEAT_BOOKED =
    "cursor-not-allowed border border-zinc-400 bg-white text-xl font-black leading-none text-red-600 shadow-[0_1px_4px_rgba(0,0,0,0.18)] ring-1 ring-inset ring-red-500/20";

export const SEAT_HELD_BY_OTHER =
    "cursor-not-allowed border-2 border-amber-500/85 text-amber-100 " +
    "bg-[repeating-linear-gradient(-45deg,_rgb(30_41_59)_0px,_rgb(30_41_59)_3px,_rgba(245,158,11,0.38)_3px,_rgba(245,158,11,0.38)_5px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

export const SEAT_REGULAR =
    "cursor-pointer border border-white/12 bg-[#2a3148] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-amber-500/40 hover:bg-[#323a54] hover:text-white";

export const SEAT_VIP =
    "cursor-pointer border border-amber-400/75 bg-gradient-to-br from-amber-400 to-orange-600 text-zinc-950 shadow-[0_2px_10px_rgba(245,158,11,0.28)] hover:from-amber-300 hover:to-orange-500 hover:shadow-[0_2px_14px_rgba(245,158,11,0.38)]";

/** Standard seat when selected — matches legend `key: "selected"`. */
const SEAT_PICKED_MATCHES_LEGEND =
    "cursor-pointer border border-zinc-600 bg-gradient-to-br from-[#FF9B8F] to-[#FB7A6E] text-zinc-900 shadow-[0_0_12px_rgba(251,137,126,0.45)] hover:from-[#FF8B7E] hover:to-[#FB6A5E] hover:shadow-[0_0_14px_rgba(251,137,126,0.5)]";

export const SEAT_PICKED_REGULAR = SEAT_PICKED_MATCHES_LEGEND;

/** VIP when selected: coral pick state + amber frame so it reads as “premium + chosen”. */
export const SEAT_PICKED_VIP =
    "cursor-pointer border-2 border-amber-400/95 bg-gradient-to-br from-amber-50 via-[#ffc9bd] to-[#FB7A6E] text-zinc-900 " +
    "shadow-[0_0_14px_rgba(251,191,36,0.42),0_0_12px_rgba(251,137,126,0.35),inset_0_1px_0_rgba(255,255,255,0.55)] " +
    "hover:border-amber-300 hover:from-amber-50 hover:via-[#ffb8a8] hover:to-[#FB6A5E] " +
    "hover:shadow-[0_0_18px_rgba(251,191,36,0.5),0_0_14px_rgba(251,137,126,0.45)]";

export const SEAT_NON_SELECTABLE =
    "cursor-default border border-white/10 bg-[#1a1f2e]/85 text-slate-500";

export function isVipSeat(seat) {
    return (
        typeof seat?.loaiGhe === "string" &&
        seat.loaiGhe.toLowerCase().includes("vip")
    );
}

export function getSeatCellClassName(seat) {
    const isBooked = seat?.daDat === true;
    const isHeldByOther = seat?.daCoNguoiChon === true;
    const isSelected = seat?.dangChon === true;
    const isSelectableSeat =
        !isBooked && !isHeldByOther && Number(seat?.gia) > 0;
    const isVip = isVipSeat(seat);

    if (isBooked) {
        return `${SEAT_CELL_BASE} ${SEAT_BOOKED}`;
    }
    if (isHeldByOther) {
        return `${SEAT_CELL_BASE} ${SEAT_HELD_BY_OTHER}`;
    }
    if (isSelected && isSelectableSeat) {
        const pickedClass = isVip ? SEAT_PICKED_VIP : SEAT_PICKED_REGULAR;
        return `${SEAT_CELL_BASE} ${pickedClass}`;
    }
    if (!isSelectableSeat) {
        return `${SEAT_CELL_BASE} ${SEAT_NON_SELECTABLE}`;
    }
    return `${SEAT_CELL_BASE} ${isVip ? SEAT_VIP : SEAT_REGULAR}`;
}

export const SEAT_LEGEND_ITEMS = [
    {
        key: "standard",
        label: "Standard",
        boxClass:
            "rounded-md border border-white/12 bg-[#2a3148] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]",
    },
    {
        key: "vip",
        label: "VIP",
        boxClass:
            "rounded-md border border-amber-400/75 bg-gradient-to-br from-amber-400 to-orange-600 shadow-[0_2px_8px_rgba(245,158,11,0.25)]",
    },
    {
        key: "vip-selected",
        label: "VIP selected",
        boxClass:
            "rounded-md border-2 border-amber-400/95 bg-gradient-to-br from-amber-50 via-[#ffc9bd] to-[#FB7A6E] text-xs font-bold text-zinc-900 shadow-[0_0_10px_rgba(251,191,36,0.38),0_0_8px_rgba(251,137,126,0.3)]",
        symbol: "✓",
    },
    {
        key: "selected",
        label: "Selected",
        boxClass:
            "rounded-md border border-zinc-600 bg-gradient-to-br from-[#FF9B8F] to-[#FB7A6E] text-sm font-bold text-zinc-900 shadow-[0_0_12px_rgba(251,137,126,0.45)]",
        symbol: "✓",
    },
    {
        key: "booked",
        label: "Booked",
        boxClass:
            "rounded-md border border-zinc-400 bg-white text-xs font-black text-red-600 shadow-sm shadow-black/15 ring-1 ring-inset ring-red-500/20",
        symbol: "X",
    },
    {
        key: "held",
        label: "Held",
        boxClass:
            "rounded-md border-2 border-amber-500/85 bg-[repeating-linear-gradient(-45deg,_rgb(30_41_59)_0px,_rgb(30_41_59)_2px,_rgba(245,158,11,0.42)_2px,_rgba(245,158,11,0.42)_4px)] text-[10px] font-bold text-amber-100",
    },
];

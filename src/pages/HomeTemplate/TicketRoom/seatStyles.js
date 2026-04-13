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

export const SEAT_PICKED_REGULAR =
    "cursor-pointer border border-zinc-600 bg-zinc-800 text-rose-400 shadow-[0_0_14px_rgba(251,113,133,0.38)] hover:border-zinc-500 hover:bg-zinc-700 hover:text-rose-300";

export const SEAT_PICKED_VIP =
    "cursor-pointer border border-zinc-600 bg-gradient-to-br from-amber-500 to-orange-600 text-rose-950 shadow-[0_0_14px_rgba(251,113,133,0.4)] hover:from-amber-400 hover:to-orange-500";

export const SEAT_NON_SELECTABLE =
    "cursor-default border border-white/10 bg-[#1a1f2e]/85 text-slate-500";

function isVipSeat(ghe) {
    return (
        typeof ghe?.loaiGhe === "string" &&
        ghe.loaiGhe.toLowerCase().includes("vip")
    );
}

export function getSeatCellClassName(ghe) {
    const daDat = ghe?.daDat === true;
    const daCoNguoiChon = ghe?.daCoNguoiChon === true;
    const dangChon = ghe?.dangChon === true;
    const isSelectableSeat = !daDat && !daCoNguoiChon && Number(ghe?.gia) > 0;
    const isVip = isVipSeat(ghe);

    if (daDat) {
        return `${SEAT_CELL_BASE} ${SEAT_BOOKED}`;
    }
    if (daCoNguoiChon) {
        return `${SEAT_CELL_BASE} ${SEAT_HELD_BY_OTHER}`;
    }
    if (dangChon && isSelectableSeat) {
        return `${SEAT_CELL_BASE} ${isVip ? SEAT_PICKED_VIP : SEAT_PICKED_REGULAR}`;
    }
    if (!isSelectableSeat) {
        return `${SEAT_CELL_BASE} ${SEAT_NON_SELECTABLE}`;
    }
    return `${SEAT_CELL_BASE} ${isVip ? SEAT_VIP : SEAT_REGULAR}`;
}

export const SEAT_LEGEND_ITEMS = [
    {
        key: "thuong",
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
        key: "dang-chon",
        label: "Selected",
        boxClass:
            "rounded-md border border-zinc-600 bg-gradient-to-br from-[#FF9B8F] to-[#FB7A6E] text-sm font-bold text-zinc-900 shadow-[0_0_12px_rgba(251,137,126,0.45)]",
        symbol: "✓",
    },
    {
        key: "da-dat",
        label: "Booked",
        boxClass:
            "rounded-md border border-zinc-400 bg-white text-xs font-black text-red-600 shadow-sm shadow-black/15 ring-1 ring-inset ring-red-500/20",
        symbol: "X",
    },
    {
        key: "giu-cho",
        label: "Held",
        boxClass:
            "rounded-md border-2 border-amber-500/85 bg-[repeating-linear-gradient(-45deg,_rgb(30_41_59)_0px,_rgb(30_41_59)_2px,_rgba(245,158,11,0.42)_2px,_rgba(245,158,11,0.42)_4px)] text-[10px] font-bold text-amber-100",
    },
];

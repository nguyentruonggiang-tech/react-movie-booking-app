/** Fixed header bar + matching <main> padding (same Tailwind scale, e.g. h-20 + pt-20). */
export const HOME_HEADER_BAR_CLASS = "h-20";
export const HOME_MAIN_PADDING_TOP_CLASS = "pt-20";

export const BOOKING_CTA =
    "rounded-full bg-[#E50914] font-black uppercase tracking-tight text-white shadow-lg shadow-[#E50914]/35 transition-colors duration-200 hover:bg-[#f40612] hover:shadow-[#f40612]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff1a24]/90 active:scale-[0.98]";

/** Shared NavLink styles: banner hero CTAs (Book now / View details). */
export const BTN_PRIMARY =
    `inline-flex items-center gap-2 px-8 py-4 ${BOOKING_CTA}`;

export const BTN_SECONDARY =
    "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20";

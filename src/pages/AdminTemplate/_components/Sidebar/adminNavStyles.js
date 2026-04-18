// ===== COLORS =====
const ROSE_BG = {
    expanded: "bg-rose-950/35",
    onRoute: "bg-rose-950/45",
};

// ===== COMMON =====
const PARENT_SHELL =
    "ring-1 ring-rose-900/35 shadow-inner shadow-black/25 hover:bg-rose-950/55 hover:text-white hover:ring-rose-800/45";

// ===== NAV CONFIG =====
export const adminSidebarNav = {
    // base
    itemBase:
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",

    subItemBase:
        "flex items-center gap-2.5 rounded-md py-2 pl-3 pr-3 text-sm font-medium transition-colors",

    // row
    rowInactive:
        "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100",

    rowActive:
        "bg-rose-600 text-white shadow-md shadow-rose-900/40",

    // parent states
    parent: {
        onRoute: `${ROSE_BG.onRoute} ${PARENT_SHELL} text-zinc-50`,
        expanded: `${ROSE_BG.expanded} ${PARENT_SHELL} text-zinc-200`,
        collapsed:
            "bg-transparent text-zinc-400 ring-0 shadow-none hover:bg-zinc-800/80 hover:text-zinc-100",
    },

    // sub item
    subItemInactive:
        "text-zinc-400 hover:bg-zinc-800/75 hover:text-zinc-100 [&_svg]:text-zinc-500 [&_svg]:opacity-90",

    subItemActiveIcons:
        "text-white [&_svg]:text-white [&_svg]:opacity-100",

    // icons
    icon: {
        md: "h-5 w-5 shrink-0",
        sm: "h-4 w-4 shrink-0",
    },

    // layout
    submenuIndent:
        "mt-0.5 space-y-0.5 border-l border-zinc-700/80 py-1 pl-2",
};
export function adminSidebarParentTriggerClass({
    isOnRoute,
    isExpanded,
}) {
    const { parent } = adminSidebarNav;

    if (isOnRoute && isExpanded) return parent.onRoute;
    if (isExpanded) return parent.expanded;
    return parent.collapsed;
}
export function adminSidebarSubNavLinkClass({ isActive }) {
    const {
        subItemBase,
        rowActive,
        subItemActiveIcons,
        subItemInactive,
    } = adminSidebarNav;

    return isActive
        ? `${subItemBase} ${rowActive} ${subItemActiveIcons}`
        : `${subItemBase} ${subItemInactive}`;
}
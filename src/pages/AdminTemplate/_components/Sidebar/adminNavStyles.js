// ===== COLORS (light + dark) =====
const ROSE_BG = {
    expanded: "bg-rose-100/80 dark:bg-rose-950/35",
    onRoute: "bg-rose-200/90 dark:bg-rose-950/45",
};

// ===== COMMON =====
const PARENT_SHELL =
    "ring-1 ring-rose-300/50 shadow-inner shadow-zinc-200/40 hover:bg-rose-100/90 hover:text-rose-950 hover:ring-rose-400/60 " +
    "dark:ring-rose-900/35 dark:shadow-inner dark:shadow-black/25 dark:hover:bg-rose-950/55 dark:hover:text-white dark:hover:ring-rose-800/45";

// ===== NAV CONFIG =====
export const adminSidebarNav = {
    // base
    itemBase:
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",

    subItemBase:
        "flex items-center gap-2.5 rounded-md py-2 pl-3 pr-3 text-sm font-medium transition-colors",

    // row
    rowInactive:
        "text-zinc-600 hover:bg-zinc-200/90 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100",

    rowActive:
        "bg-rose-600 text-white shadow-md shadow-rose-900/25 dark:shadow-rose-900/40",

    // parent states
    parent: {
        onRoute: `${ROSE_BG.onRoute} ${PARENT_SHELL} text-rose-950 dark:text-zinc-50`,
        expanded: `${ROSE_BG.expanded} ${PARENT_SHELL} text-rose-900 dark:text-zinc-200`,
        collapsed:
            "bg-transparent text-zinc-600 ring-0 shadow-none hover:bg-zinc-200/90 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100",
    },

    // sub item
    subItemInactive:
        "text-zinc-600 hover:bg-zinc-200/85 hover:text-zinc-900 [&_svg]:text-zinc-500 [&_svg]:opacity-90 dark:text-zinc-400 dark:hover:bg-zinc-800/75 dark:hover:text-zinc-100 dark:[&_svg]:text-zinc-500",

    subItemActiveIcons:
        "text-white [&_svg]:text-white [&_svg]:opacity-100",

    // icons
    icon: {
        md: "h-5 w-5 shrink-0",
        sm: "h-4 w-4 shrink-0",
    },

    // layout
    submenuIndent:
        "mt-0.5 space-y-0.5 border-l border-zinc-300 py-1 pl-2 dark:border-zinc-700/80",
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

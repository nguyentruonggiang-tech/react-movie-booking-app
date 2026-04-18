import {
    Clock,
    User,
    ArrowRightToBracket,
} from "flowbite-react-icons/outline";

export const PROFILE_TAB_PERSONAL = "personal";
export const PROFILE_TAB_BOOKING = "booking-history";

const navItemBase =
    "flex w-full items-center gap-3 rounded-l-md rounded-r-lg px-4 py-3 text-left text-sm font-medium transition";

function navItemClass(isActive) {
    if (isActive) {
        return `${navItemBase} border-l-2 border-rose-500 bg-zinc-800/60 pl-[14px] text-white`;
    }
    return `${navItemBase} border-l-2 border-transparent text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200`;
}

const menuItems = [
    {
        id: PROFILE_TAB_PERSONAL,
        label: "Account Information",
        Icon: User,
    },
    {
        id: PROFILE_TAB_BOOKING,
        label: "Booking history",
        Icon: Clock,
    },
];

export default function ProfileMenu({ activeTab, onSelectTab, onLogout }) {
    return (
        <nav
            className="rounded-l-lg rounded-r-xl border border-zinc-800 bg-zinc-900/80 p-2 shadow-sm shadow-black/20"
            aria-label="Profile"
        >
            <ul className="space-y-0.5">
                {menuItems.map((item) => {
                    const { id, label } = item;
                    const IconComponent = item.Icon;
                    const isActive = activeTab === id;
                    return (
                        <li key={id}>
                            <button
                                type="button"
                                onClick={() => onSelectTab(id)}
                                className={navItemClass(isActive)}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <IconComponent
                                    className="h-5 w-5 shrink-0 opacity-90"
                                    aria-hidden
                                />
                                {label}
                            </button>
                        </li>
                    );
                })}
            </ul>
            <div className="mt-3 border-t border-zinc-800 pt-2">
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-l-md rounded-r-lg px-4 py-3 text-left text-sm font-semibold text-rose-400 transition hover:bg-rose-950/30 hover:text-rose-300"
                >
                    <ArrowRightToBracket
                        className="h-5 w-5 shrink-0"
                        aria-hidden
                    />
                    Sign out
                </button>
            </div>
        </nav>
    );
}

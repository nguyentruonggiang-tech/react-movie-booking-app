import { User, ArrowRightToBracket } from "flowbite-react-icons/outline";

const navItemBase =
    "flex w-full items-center gap-3 rounded-l-md rounded-r-lg px-4 py-3 text-left text-sm font-medium transition";

const navItemActiveClass = `${navItemBase} border-l-2 border-rose-500 bg-zinc-800/60 pl-[14px] text-white`;

export default function ProfileMenu({ onLogout }) {
    return (
        <nav
            className="rounded-l-lg rounded-r-xl border border-zinc-800 bg-zinc-900/80 p-2 shadow-sm shadow-black/20"
            aria-label="Profile"
        >
            <ul className="space-y-0.5">
                <li>
                    <div
                        className={navItemActiveClass}
                        aria-current="page"
                        role="presentation"
                    >
                        <User
                            className="h-5 w-5 shrink-0 opacity-90"
                            aria-hidden
                        />
                        Personal information
                    </div>
                </li>
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

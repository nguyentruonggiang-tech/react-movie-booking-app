import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { HOME_HEADER_BAR_CLASS } from "../../constants";

const navDesktopUnderline =
    "md:relative md:inline-block md:pb-2 md:transition-colors md:duration-200 " +
    "md:after:pointer-events-none md:after:absolute md:after:inset-x-0 md:after:bottom-0 md:after:h-0.5 md:after:origin-left md:after:bg-red-600 " +
    "md:after:transition-transform md:after:duration-300 md:after:ease-out";

const authBtnDesktopSize =
    "md:box-border md:h-10 md:min-h-10 md:w-28 md:shrink-0 md:px-2 md:py-0";

function authDesktopLoginClass(isActive) {
    const base =
        "hidden md:inline-flex md:items-center md:justify-center md:rounded-md md:text-sm md:font-semibold " +
        `${authBtnDesktopSize} md:transition-colors md:duration-200 `;
    if (isActive) {
        return (
            base +
            "md:border md:border-red-600 md:bg-red-600 md:text-white md:shadow-none " +
            "md:hover:bg-red-500 md:hover:border-red-500 md:hover:text-white"
        );
    }
    return (
        base +
        "md:border md:border-red-600/55 md:bg-transparent md:text-red-600 " +
        "md:hover:border-red-600 md:hover:bg-red-600 md:hover:text-white md:hover:shadow-none"
    );
}

function authDesktopRegisterClass(isActive, pathname) {
    const base =
        "hidden md:inline-flex md:items-center md:justify-center md:rounded-md md:text-sm md:font-semibold " +
        `${authBtnDesktopSize} `;

    if (isActive) {
        return (
            base +
            "md:border md:border-transparent md:bg-red-600 md:text-white md:transition-all md:duration-200 " +
            "md:shadow-[0_0_20px_rgba(220,38,38,0.45)] " +
            "md:hover:bg-red-500 md:hover:shadow-[0_0_24px_rgba(220,38,38,0.55)]"
        );
    }

    if (pathname === "/login") {
        return (
            base +
            "md:border md:border-red-600/55 md:bg-transparent md:text-red-600 md:transition-colors md:duration-200 " +
            "md:hover:border-red-600 md:hover:bg-red-600 md:hover:text-white md:hover:shadow-none"
        );
    }

    return (
        base +
        "md:border md:border-transparent md:bg-red-600 md:text-white md:transition-all md:duration-200 " +
        "md:hover:bg-red-500 md:hover:shadow-[0_0_22px_rgba(220,38,38,0.5)]"
    );
}

function navMainLinkClass(isActive) {
    if (isActive) {
        return (
            "flex w-full items-center rounded-md px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors " +
            "bg-red-600/15 hover:bg-red-600/25 active:bg-red-600/30 " +
            "md:w-auto md:rounded-none md:bg-transparent md:px-0 md:py-0 md:text-base md:font-bold md:text-red-600 md:opacity-100 " +
            "md:hover:bg-transparent md:hover:text-red-600 md:hover:opacity-100 md:active:bg-transparent " +
            `${navDesktopUnderline} md:after:scale-x-100`
        );
    }
    return (
        "flex w-full items-center rounded-md px-3 py-2.5 text-sm text-white transition-colors " +
        "hover:bg-red-600/15 hover:text-white hover:font-semibold active:bg-red-600/25 " +
        "md:w-auto md:rounded-none md:bg-transparent md:px-0 md:py-0 md:text-base md:font-normal " +
        "md:text-slate-200 md:opacity-100 " +
        "md:hover:bg-transparent md:hover:text-red-600 md:hover:opacity-100 md:hover:font-normal md:active:bg-transparent " +
        `${navDesktopUnderline} md:after:scale-x-0 md:hover:after:scale-x-100`
    );
}

export default function Header() {
    const { pathname } = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close mobile menu after route change without synchronous setState in effect body (react-hooks/set-state-in-effect).
    useEffect(() => {
        const id = requestAnimationFrame(() => setMenuOpen(false));
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] w-full border-b border-white/10 bg-slate-950/95 font-sans shadow-sm backdrop-blur-md ${HOME_HEADER_BAR_CLASS}`}
        >
            <div className="relative mx-auto flex h-full w-full items-center justify-between px-4 md:px-8">
                <NavLink to="/" end className="relative z-20 flex shrink-0 items-center">
                    <span className="text-2xl font-black uppercase text-red-600">Movie Booking</span>
                </NavLink>

                <div className="relative z-20 ms-auto flex shrink-0 items-center gap-2 md:gap-3">
                    <NavLink to="/login" end className={({ isActive }) => authDesktopLoginClass(isActive)}>
                        Sign in
                    </NavLink>
                    <NavLink to="/register" end className={({ isActive }) => authDesktopRegisterClass(isActive, pathname)}>
                        Sign up
                    </NavLink>
                    <button
                        type="button"
                        className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-600/15 md:hidden"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-controls="navbar-main"
                        aria-expanded={menuOpen}
                    >
                        <span className="sr-only">Open menu</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* Collapse: mobile uses menuOpen; desktop always visible + centered */}
                <div
                    id="navbar-main"
                    className={
                        "max-md:absolute max-md:top-full max-md:left-0 max-md:right-0 max-md:z-[101] max-md:border-t max-md:border-white/10 max-md:bg-slate-950/98 max-md:px-4 max-md:py-3 max-md:shadow-lg max-md:backdrop-blur-md " +
                        "md:absolute md:left-1/2 md:top-1/2 md:z-10 md:w-max md:max-w-[min(100%,calc(100%-12rem))] md:-translate-x-1/2 md:-translate-y-1/2 " +
                        "md:border-0 md:bg-transparent md:p-0 " +
                        (menuOpen ? "max-md:block" : "max-md:hidden") +
                        " md:block"
                    }
                >
                    <ul className="flex flex-col gap-1 md:mt-0 md:flex-row md:items-center md:justify-center md:gap-8">
                        <li className="list-none">
                            <NavLink to="/" end className={({ isActive }) => navMainLinkClass(isActive)}>
                                Home
                            </NavLink>
                        </li>
                        <li className="list-none">
                            <NavLink to="/contact" end className={({ isActive }) => navMainLinkClass(isActive)}>
                                Contact
                            </NavLink>
                        </li>
                        <li className="list-none">
                            <NavLink to="/news" end className={({ isActive }) => navMainLinkClass(isActive)}>
                                News
                            </NavLink>
                        </li>
                        <li className="list-none px-3 md:hidden" aria-hidden="true">
                            <div className="my-2 h-px w-full bg-white/15" />
                        </li>
                        <li className="list-none md:hidden">
                            <NavLink to="/login" className={({ isActive }) => navMainLinkClass(isActive)}>
                                Sign in
                            </NavLink>
                        </li>
                        <li className="list-none md:hidden">
                            <NavLink to="/register" className={({ isActive }) => navMainLinkClass(isActive)}>
                                Sign up
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

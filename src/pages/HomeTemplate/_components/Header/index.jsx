import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { actLogout } from "@pages/Auth/slice";
import { SITE_NAME } from "@constants";
import { HOME_HEADER_BAR_CLASS } from "../../constants";

const DEFAULT_DISPLAY_NAME = "Tài khoản";

const navDesktopUnderline =
    "md:relative md:inline-block md:pb-2 md:transition-colors md:duration-200 " +
    "md:after:pointer-events-none md:after:absolute md:after:inset-x-0 md:after:bottom-0 md:after:h-0.5 md:after:origin-left md:after:bg-red-600 " +
    "md:after:transition-transform md:after:duration-300 md:after:ease-out";

const authBtnDesktopSize =
    "md:box-border md:h-10 md:min-h-10 md:w-28 md:shrink-0 md:px-2 md:py-0";

function authDesktopSignInClass(isActive) {
    const base =
        "inline-flex items-center justify-center rounded-md text-sm font-semibold " +
        `${authBtnDesktopSize} transition-colors duration-200 `;
    if (isActive) {
        return (
            base +
            "border border-red-600 bg-red-600 text-white shadow-none " +
            "hover:border-red-500 hover:bg-red-500 hover:text-white"
        );
    }
    return (
        base +
        "border border-red-600/55 bg-transparent text-red-600 " +
        "hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow-none"
    );
}

function authDesktopSignUpClass(isActive) {
    const base =
        "inline-flex items-center justify-center rounded-md text-sm font-semibold " +
        `${authBtnDesktopSize} transition-colors duration-200 `;
    if (isActive) {
        return (
            base +
            "border border-white/25 bg-white/10 text-white " +
            "hover:border-white/40 hover:bg-white/15"
        );
    }
    return (
        base +
        "border border-white/15 bg-transparent text-slate-200 " +
        "hover:border-white/30 hover:bg-white/5 hover:text-white"
    );
}

function userMenuAvatarInitials(displayLabel, loginName) {
    const fromName = String(displayLabel || "").trim();
    if (fromName && fromName !== DEFAULT_DISPLAY_NAME) {
        const parts = fromName.split(/\s+/).filter(Boolean);
        if (parts.length >= 2) {
            return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
        }
        return fromName.slice(0, 2).toUpperCase();
    }
    const fromLogin = String(loginName || "").trim();
    if (fromLogin) return fromLogin.slice(0, 2).toUpperCase();
    return "UN";
}

/* Flowbite-style dropdown rows (semantic tokens from docs → slate/red in this build) */
const userDropdownLinkClass =
    "inline-flex w-full items-center rounded-md p-2 text-slate-200 transition-colors hover:bg-white/10 hover:text-white";
const userDropdownSignOutClass =
    "inline-flex w-full cursor-pointer items-center rounded-md p-2 text-left text-red-300 transition-colors hover:bg-red-600/15 hover:text-red-200";
const LOGOUT_SUCCESS_TOAST_ID = "logout-success";

function UserAccountDropdownPanel({
    displayName,
    accountEmail,
    menuLabelledById,
    onAccountInfoNavigate,
    onSignOutClick,
}) {
    return (
        <>
            <div className="border-b border-white/10 px-4 py-3 text-sm">
                <span className="block font-medium text-white">{displayName}</span>
                {accountEmail ? (
                    <span className="mt-0.5 block truncate text-sm text-slate-400">{accountEmail}</span>
                ) : null}
            </div>
            <ul className="p-2 text-sm font-medium" aria-labelledby={menuLabelledById}>
                <li>
                    <NavLink
                        to="/profile"
                        onClick={onAccountInfoNavigate}
                        className={userDropdownLinkClass}
                        role="menuitem"
                    >
                        Thông tin tài khoản
                    </NavLink>
                </li>
                <li>
                    <button
                        type="button"
                        onClick={onSignOutClick}
                        className={userDropdownSignOutClass}
                        role="menuitem"
                    >
                        Đăng xuất
                    </button>
                </li>
            </ul>
        </>
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
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authUser = useSelector((state) => state.authLoginReducer?.data);
    const { pathname } = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    /** Desktop only: show dropdown on hover without pinning open (pin uses userMenuOpen). */
    const [desktopUserHovered, setDesktopUserHovered] = useState(false);
    const mobileUserMenuRef = useRef(null);
    const desktopUserMenuRef = useRef(null);
    const userMenuOpenRef = useRef(userMenuOpen);
    const desktopUserHoveredRef = useRef(desktopUserHovered);
    const mainNavPanelRef = useRef(null);
    const hamburgerRef = useRef(null);

    const isAuthenticated = Boolean(authUser?.accessToken || authUser?.taiKhoan);
    const displayName = authUser?.hoTen?.trim() || DEFAULT_DISPLAY_NAME;
    const accountEmail = authUser?.email?.trim() || authUser?.taiKhoan?.trim() || "";
    const avatarInitials = userMenuAvatarInitials(displayName, authUser?.taiKhoan);

    const handleSignOut = () => {
        setUserMenuOpen(false);
        setDesktopUserHovered(false);
        setMenuOpen(false);
        dispatch(actLogout());
        toast.success("Đăng xuất thành công.", {
            toastId: LOGOUT_SUCCESS_TOAST_ID,
        });
        navigate("/", { replace: true });
    };

    // Close mobile menu after route change without synchronous setState in effect body (react-hooks/set-state-in-effect).
    useEffect(() => {
        const id = requestAnimationFrame(() => {
            setMenuOpen(false);
            setUserMenuOpen(false);
            setDesktopUserHovered(false);
        });
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    useEffect(() => {
        userMenuOpenRef.current = userMenuOpen;
        desktopUserHoveredRef.current = desktopUserHovered;
    }, [userMenuOpen, desktopUserHovered]);

    // Close menus when pointer happens outside the menu / its toggle (bubble phase).
    useEffect(() => {
        if (!userMenuOpen && !menuOpen && !desktopUserHovered) return undefined;

        const handlePointerDown = (event) => {
            const target = event.target;
            if (userMenuOpen || desktopUserHovered) {
                const inMobile = mobileUserMenuRef.current?.contains(target) ?? false;
                const inDesktop = desktopUserMenuRef.current?.contains(target) ?? false;
                if (!inMobile && !inDesktop) {
                    setUserMenuOpen(false);
                    setDesktopUserHovered(false);
                }
            }
            if (menuOpen) {
                const panel = mainNavPanelRef.current;
                const burger = hamburgerRef.current;
                if (panel && burger && !panel.contains(target) && !burger.contains(target)) {
                    setMenuOpen(false);
                }
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
        };
    }, [userMenuOpen, menuOpen, desktopUserHovered]);

    return (
        <nav
            className={`fixed start-0 top-0 z-[100] w-full border-b border-white/10 bg-slate-950/95 font-sans shadow-sm backdrop-blur-md ${HOME_HEADER_BAR_CLASS}`}
        >
            <div className="relative mx-auto flex h-full w-full max-w-screen-xl flex-wrap items-center justify-between gap-y-2 px-4 md:px-8">
                <NavLink
                    to="/"
                    end
                    className="relative z-20 flex shrink-0 items-center space-x-3 rtl:space-x-reverse"
                >
                    <span className="self-center whitespace-nowrap text-2xl font-black uppercase text-red-600">
                        {SITE_NAME}
                    </span>
                </NavLink>

                <div className="relative z-20 flex shrink-0 items-center space-x-2 md:order-2 md:space-x-3 rtl:space-x-reverse">
                    {isAuthenticated ? (
                        <>
                            <div ref={mobileUserMenuRef} className="relative flex items-center md:hidden">
                                <button
                                    type="button"
                                    className="box-border flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-slate-800 text-sm [-webkit-tap-highlight-color:transparent] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500/50 active:bg-slate-800/90 md:me-0"
                                    id="user-menu-button-mobile"
                                    aria-expanded={userMenuOpen}
                                    aria-haspopup="menu"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setDesktopUserHovered(false);
                                        setUserMenuOpen((open) => !open);
                                    }}
                                >
                                    <span className="sr-only">Mở menu tài khoản</span>
                                    <span
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-800 text-xs font-semibold text-white"
                                        aria-hidden
                                    >
                                        {avatarInitials}
                                    </span>
                                </button>
                                {userMenuOpen ? (
                                    <div
                                        className="absolute end-0 top-full z-50 mt-1.5 w-44 rounded-base border border-white/15 bg-slate-950/98 shadow-lg backdrop-blur-md"
                                        id="user-dropdown-mobile"
                                        role="menu"
                                    >
                                        <UserAccountDropdownPanel
                                            displayName={displayName}
                                            accountEmail={accountEmail}
                                            menuLabelledById="user-menu-button-mobile"
                                            onAccountInfoNavigate={() => setUserMenuOpen(false)}
                                            onSignOutClick={handleSignOut}
                                        />
                                    </div>
                                ) : null}
                            </div>

                            <div className="relative hidden items-center md:flex md:space-x-3 rtl:space-x-reverse">
                                <div
                                    ref={desktopUserMenuRef}
                                    className="relative"
                                    onMouseEnter={() => setDesktopUserHovered(true)}
                                    onMouseLeave={() => {
                                        setDesktopUserHovered(false);
                                        setUserMenuOpen(false);
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="box-border flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-slate-800 text-sm [-webkit-tap-highlight-color:transparent] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500/50 md:me-0"
                                        id="user-menu-button"
                                        aria-expanded={userMenuOpen || desktopUserHovered}
                                        aria-haspopup="menu"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            const pinned = userMenuOpenRef.current;
                                            const hovered = desktopUserHoveredRef.current;
                                            // Pinned open → close. Hover-only open → close hover (do not pin). Closed → pin open.
                                            if (pinned) {
                                                setUserMenuOpen(false);
                                                setDesktopUserHovered(false);
                                            } else if (hovered) {
                                                setUserMenuOpen(false);
                                                setDesktopUserHovered(false);
                                            } else {
                                                setUserMenuOpen(true);
                                                setDesktopUserHovered(false);
                                            }
                                        }}
                                    >
                                        <span className="sr-only">Mở menu tài khoản</span>
                                        <span
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-800 text-xs font-semibold text-white"
                                            aria-hidden
                                        >
                                            {avatarInitials}
                                        </span>
                                    </button>
                                    {userMenuOpen || desktopUserHovered ? (
                                        <div
                                            className="absolute end-0 top-full z-50 mt-0 w-44 -translate-y-px rounded-base border border-white/15 bg-slate-950/98 shadow-lg backdrop-blur-md"
                                            id="user-dropdown"
                                            role="menu"
                                        >
                                            <UserAccountDropdownPanel
                                                displayName={displayName}
                                                accountEmail={accountEmail}
                                                menuLabelledById="user-menu-button"
                                                onAccountInfoNavigate={() => {
                                                    setUserMenuOpen(false);
                                                    setDesktopUserHovered(false);
                                                }}
                                                onSignOutClick={handleSignOut}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="hidden items-center gap-2 md:flex">
                            <NavLink to="/register" end className={({ isActive }) => authDesktopSignUpClass(isActive)}>
                                Đăng ký
                            </NavLink>
                            <NavLink to="/login" end className={({ isActive }) => authDesktopSignInClass(isActive)}>
                                Đăng nhập
                            </NavLink>
                        </div>
                    )}
                    <button
                        ref={hamburgerRef}
                        type="button"
                        className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-base border border-transparent p-2 text-sm text-slate-300 [-webkit-tap-highlight-color:transparent] transition-colors hover:border-white/10 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500/50 active:bg-white/5 md:hidden"
                        data-collapse-toggle="navbar-main"
                        onClick={() => {
                            setUserMenuOpen(false);
                            setDesktopUserHovered(false);
                            setMenuOpen((o) => !o);
                        }}
                        aria-controls="navbar-main"
                        aria-expanded={menuOpen}
                    >
                        <span className="sr-only">Mở menu chính</span>
                        <svg
                            className="h-6 w-6"
                            aria-hidden
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="2"
                                d="M5 7h14M5 12h14M5 17h14"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile: absolute panel avoids flex-wrap reflow (hamburger row jumping). Desktop: centered flex row. */}
                <div
                    ref={mainNavPanelRef}
                    id="navbar-main"
                    className={
                        "order-3 w-full md:order-1 md:flex md:w-auto md:flex-1 md:items-center md:justify-center " +
                        "max-md:absolute max-md:inset-x-0 max-md:top-full max-md:z-[101] " +
                        "max-md:rounded-base max-md:border max-md:border-white/10 max-md:bg-slate-900/95 max-md:p-4 max-md:shadow-lg " +
                        "md:border-0 md:bg-transparent md:p-0 md:shadow-none " +
                        (menuOpen ? "max-md:block" : "max-md:hidden") +
                        " md:block"
                    }
                >
                    <ul className="flex max-md:mt-0 flex-col gap-1 font-medium md:mt-0 md:flex-row md:items-center md:gap-8">
                        <li className="list-none">
                            <NavLink to="/" end className={({ isActive }) => navMainLinkClass(isActive)}>
                                Trang chủ
                            </NavLink>
                        </li>
                        <li className="list-none">
                            <NavLink to="/contact" end className={({ isActive }) => navMainLinkClass(isActive)}>
                                Liên hệ
                            </NavLink>
                        </li>
                        <li className="list-none">
                            <NavLink to="/news" end className={({ isActive }) => navMainLinkClass(isActive)}>
                                Tin tức
                            </NavLink>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li className="list-none px-3 md:hidden" aria-hidden="true">
                                    <div className="my-2 h-px w-full bg-white/15" />
                                </li>
                                <li className="list-none md:hidden">
                                    <NavLink to="/register" className={({ isActive }) => navMainLinkClass(isActive)}>
                                        Đăng ký
                                    </NavLink>
                                </li>
                                <li className="list-none md:hidden">
                                    <NavLink to="/login" className={({ isActive }) => navMainLinkClass(isActive)}>
                                        Đăng nhập
                                    </NavLink>
                                </li>
                            </>
                        ) : null}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

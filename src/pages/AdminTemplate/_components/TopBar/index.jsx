import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { actLogout } from "@pages/Auth/slice";

function getAvatarInitials(hoTen, taiKhoan) {
    const name = String(hoTen ?? "").trim();
    if (name) {
        const parts = name.split(/\s+/).filter(Boolean);
        if (parts.length >= 2) {
            const a = parts[0][0];
            const b = parts[parts.length - 1][0];
            return `${a}${b}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }
    const account = String(taiKhoan ?? "").trim();
    return (account.slice(0, 2) || "?").toUpperCase();
}

function getSessionDisplayName(user) {
    if (!user) return "";
    const hoTen = String(user.hoTen ?? "").trim();
    if (hoTen) return hoTen;
    return String(user.taiKhoan ?? "").trim() || "User";
}

const USER_MENU_ID = "admin-user-menu";

/** Dropdown rows — aligned with admin zinc palette + Home header interaction pattern */
const userDropdownLinkClass =
    "inline-flex w-full items-center rounded-md p-2 text-zinc-200 transition-colors hover:bg-zinc-800/80 hover:text-white";

const userDropdownSignOutClass =
    "inline-flex w-full cursor-pointer items-center rounded-md p-2 text-left text-red-300 transition-colors hover:bg-red-600/15 hover:text-red-200";

export default function TopBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.authLoginReducer?.data);
    const [menuOpen, setMenuOpen] = useState(false);
    const wrapRef = useRef(null);

    const displayName = getSessionDisplayName(user);
    const initials = getAvatarInitials(user?.hoTen, user?.taiKhoan);
    const accountEmail =
        String(user?.email ?? "").trim() || String(user?.taiKhoan ?? "").trim() || "";

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    useEffect(() => {
        if (!menuOpen) return;
        function handlePointerDown(event) {
            if (wrapRef.current && !wrapRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        }
        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuOpen]);

    async function handleSignOut() {
        closeMenu();
        await dispatch(actLogout()).unwrap();
        navigate("/login", { replace: true });
    }

    return (
        <header className="flex h-14 shrink-0 items-center justify-end border-b border-zinc-800 bg-zinc-900/80 px-6 lg:px-8">
            <div className="relative" ref={wrapRef}>
                <button
                    type="button"
                    id="admin-user-menu-button"
                    aria-expanded={menuOpen}
                    aria-haspopup="menu"
                    aria-controls={USER_MENU_ID}
                    aria-label={
                        displayName ? `Account menu for ${displayName}` : "Account menu"
                    }
                    title={displayName || undefined}
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full border border-zinc-600 bg-rose-600 text-[0.65rem] font-bold uppercase leading-none tracking-wide text-white shadow-md shadow-rose-900/30 outline-none ring-rose-500/50 transition hover:bg-rose-500 focus-visible:ring-2"
                >
                    {initials}
                </button>

                {menuOpen ? (
                    <div
                        id={USER_MENU_ID}
                        role="menu"
                        aria-labelledby="admin-user-menu-button"
                        className="absolute end-0 top-full z-50 mt-1.5 w-44 rounded-lg border border-zinc-700/80 bg-zinc-950/98 shadow-lg shadow-black/40 backdrop-blur-md"
                    >
                        <div className="border-b border-zinc-800 px-4 py-3 text-sm">
                            <span className="block font-medium text-white">{displayName}</span>
                            {accountEmail ? (
                                <span className="mt-0.5 block truncate text-zinc-400">{accountEmail}</span>
                            ) : null}
                        </div>
                        <ul className="p-2 text-sm font-medium">
                            <li>
                                <NavLink
                                    to="/profile"
                                    role="menuitem"
                                    className={userDropdownLinkClass}
                                    onClick={closeMenu}
                                >
                                    Account Info
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    role="menuitem"
                                    className={userDropdownSignOutClass}
                                    onClick={handleSignOut}
                                >
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : null}
            </div>
        </header>
    );
}

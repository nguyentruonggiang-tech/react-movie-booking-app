import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    ArrowRightIcon,
    BarsIcon,
    CalendarIcon,
} from "flowbite-react/icons";
import {
    ChevronDown,
    Plus,
    RectangleList,
    Users,
} from "flowbite-react-icons/outline";
import { actLogout } from "@pages/Auth/slice";
import { SITE_NAME } from "@constants";
import {
    adminSidebarNav,
    adminSidebarParentTriggerClass,
    adminSidebarSubNavLinkClass,
} from "./adminNavStyles";

const FILMS_PATH_PREFIX = "/admin/films";
const USERS_PATH_PREFIX = "/admin/users";

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isUnderFilms = location.pathname.startsWith(FILMS_PATH_PREFIX);
    const isUnderUsers = location.pathname.startsWith(USERS_PATH_PREFIX);
    const [filmsOpen, setFilmsOpen] = useState(isUnderFilms);
    const [usersOpen, setUsersOpen] = useState(isUnderUsers);

    useEffect(() => {
        if (isUnderFilms) {
            setFilmsOpen(true);
            setUsersOpen(false);
        }
    }, [isUnderFilms]);

    useEffect(() => {
        if (isUnderUsers) {
            setUsersOpen(true);
            setFilmsOpen(false);
        }
    }, [isUnderUsers]);

    function handleLogout() {
        dispatch(actLogout());
        navigate("/login", { replace: true });
    }

    const { itemBase, rowInactive, iconMd, iconSm, submenuIndent } =
        adminSidebarNav;

    return (
        <div className="flex h-full min-h-screen flex-col py-4">
            <div className="border-b border-zinc-800 px-4 pb-2">
                <p className="mb-2 text-justify text-2xl font-bold uppercase tracking-tight text-rose-600">
                    {SITE_NAME}
                </p>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-4 py-3">
                <div className="rounded-md">
                    <button
                        type="button"
                        aria-expanded={filmsOpen}
                        aria-controls="sidebar-films-submenu"
                        id="sidebar-films-trigger"
                        onClick={() =>
                            setFilmsOpen((wasOpen) => {
                                const next = !wasOpen;
                                if (next) {
                                    setUsersOpen(false);
                                }
                                return next;
                            })
                        }
                        className={`${itemBase} w-full justify-between ${adminSidebarParentTriggerClass({
                            isOnRoute: isUnderFilms,
                            isExpanded: filmsOpen,
                        })}`}
                    >
                        <span className="flex min-w-0 items-center gap-3">
                            <CalendarIcon className={iconMd} aria-hidden />
                            <span className="truncate">Phim</span>
                        </span>
                        <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                                filmsOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden
                        />
                    </button>

                    <div
                        id="sidebar-films-submenu"
                        role="group"
                        aria-labelledby="sidebar-films-trigger"
                        hidden={!filmsOpen}
                        className={submenuIndent}
                    >
                        <NavLink
                            to="/admin/films"
                            end
                            className={({ isActive }) =>
                                adminSidebarSubNavLinkClass({
                                    isActive: Boolean(isActive && filmsOpen),
                                })
                            }
                        >
                            <RectangleList
                                className={iconSm}
                                aria-hidden
                            />
                            Danh sách phim
                        </NavLink>
                        <NavLink
                            to="/admin/films/addnew"
                            className={({ isActive }) =>
                                adminSidebarSubNavLinkClass({
                                    isActive: Boolean(isActive && filmsOpen),
                                })
                            }
                        >
                            <Plus className={iconSm} aria-hidden />
                            Thêm phim
                        </NavLink>
                    </div>
                </div>

                <div className="rounded-md">
                    <button
                        type="button"
                        aria-expanded={usersOpen}
                        aria-controls="sidebar-users-submenu"
                        id="sidebar-users-trigger"
                        onClick={() =>
                            setUsersOpen((wasOpen) => {
                                const next = !wasOpen;
                                if (next) {
                                    setFilmsOpen(false);
                                }
                                return next;
                            })
                        }
                        className={`${itemBase} w-full justify-between ${adminSidebarParentTriggerClass({
                            isOnRoute: isUnderUsers,
                            isExpanded: usersOpen,
                        })}`}
                    >
                        <span className="flex min-w-0 items-center gap-3">
                            <Users className={iconMd} aria-hidden />
                            <span className="truncate">Người dùng</span>
                        </span>
                        <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                                usersOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden
                        />
                    </button>

                    <div
                        id="sidebar-users-submenu"
                        role="group"
                        aria-labelledby="sidebar-users-trigger"
                        hidden={!usersOpen}
                        className={submenuIndent}
                    >
                        <NavLink
                            to="/admin/users"
                            end
                            className={({ isActive }) =>
                                adminSidebarSubNavLinkClass({
                                    isActive: Boolean(isActive && usersOpen),
                                })
                            }
                        >
                            <RectangleList
                                className={iconSm}
                                aria-hidden
                            />
                            Danh sách người dùng
                        </NavLink>
                        <NavLink
                            to="/admin/users/add"
                            className={({ isActive }) =>
                                adminSidebarSubNavLinkClass({
                                    isActive: Boolean(isActive && usersOpen),
                                })
                            }
                        >
                            <Plus className={iconSm} aria-hidden />
                            Thêm người dùng
                        </NavLink>
                    </div>
                </div>
            </nav>

            <div className="mt-auto space-y-3 border-t border-zinc-800 px-4 pt-6">
                <button
                    type="button"
                    className={`${itemBase} w-full ${rowInactive} border border-transparent`}
                    onClick={() => {}}
                >
                    <BarsIcon className={iconMd} aria-hidden />
                    Cài đặt
                </button>
                <button
                    type="button"
                    className={`${itemBase} w-full ${rowInactive}`}
                    onClick={handleLogout}
                >
                    <ArrowRightIcon className={iconMd} aria-hidden />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}

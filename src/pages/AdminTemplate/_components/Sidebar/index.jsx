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
} from "flowbite-react-icons/outline";
import { actLogout } from "@pages/Auth/slice";
import { SITE_NAME } from "@constants";
import {
    adminSidebarNav,
    adminSidebarParentTriggerClass,
    adminSidebarSubNavLinkClass,
} from "./adminNavStyles";

const FILMS_PATH_PREFIX = "/admin/films";

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isUnderFilms = location.pathname.startsWith(FILMS_PATH_PREFIX);
    const [filmsOpen, setFilmsOpen] = useState(isUnderFilms);

    useEffect(() => {
        if (isUnderFilms) {
            setFilmsOpen(true);
        }
    }, [isUnderFilms]);

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
                        onClick={() => setFilmsOpen((open) => !open)}
                        className={`${itemBase} w-full justify-between ${adminSidebarParentTriggerClass({
                            isOnRoute: isUnderFilms,
                            isExpanded: filmsOpen,
                        })}`}
                    >
                        <span className="flex min-w-0 items-center gap-3">
                            <CalendarIcon className={iconMd} aria-hidden />
                            <span className="truncate">Films</span>
                        </span>
                        <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                                filmsOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden
                        />
                    </button>

                    {filmsOpen ? (
                        <div
                            id="sidebar-films-submenu"
                            role="group"
                            aria-labelledby="sidebar-films-trigger"
                            className={submenuIndent}
                        >
                            <NavLink
                                to="/admin/films"
                                end
                                className={({ isActive }) =>
                                    adminSidebarSubNavLinkClass({ isActive })
                                }
                            >
                                <RectangleList
                                    className={iconSm}
                                    aria-hidden
                                />
                                Film list
                            </NavLink>
                            <NavLink
                                to="/admin/films/addnew"
                                className={({ isActive }) =>
                                    adminSidebarSubNavLinkClass({ isActive })
                                }
                            >
                                <Plus className={iconSm} aria-hidden />
                                Add film
                            </NavLink>
                        </div>
                    ) : null}
                </div>
            </nav>

            <div className="mt-auto space-y-3 border-t border-zinc-800 px-4 pt-6">
                <button
                    type="button"
                    className={`${itemBase} w-full ${rowInactive} border border-transparent`}
                    onClick={() => {}}
                >
                    <BarsIcon className={iconMd} aria-hidden />
                    Settings
                </button>
                <button
                    type="button"
                    className={`${itemBase} w-full ${rowInactive}`}
                    onClick={handleLogout}
                >
                    <ArrowRightIcon className={iconMd} aria-hidden />
                    Sign out
                </button>
            </div>
        </div>
    );
}

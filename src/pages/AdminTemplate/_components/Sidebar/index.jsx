import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
    ArrowRightIcon,
    BarsIcon,
    CalendarIcon
} from "flowbite-react/icons";
import { actLogout } from "@pages/Auth/slice";
import { SITE_NAME } from "@constants";

const navBase =
    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors";
const navInactive = "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100";
const navActive = "bg-rose-600 text-white shadow-md shadow-rose-900/40";

const iconClass = "h-5 w-5 shrink-0";

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(actLogout());
        navigate("/login", { replace: true });
    }

    return (
        <div className="flex h-full min-h-screen flex-col py-4">
            <div className="px-1 border-b border-zinc-800 px-4">
                <p className="text-2xl font-bold text-justify uppercase tracking-tight text-rose-600 mb-2">{SITE_NAME}</p>
            </div>
       
            <nav className="flex flex-1 flex-col gap-1 py-3 px-4">
                <NavLink
                    to="/admin/films"
                    className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}
                    end={false}
                >
                    <CalendarIcon className={iconClass} aria-hidden />
                    Films
                </NavLink>
            </nav>

            <div className="mt-auto space-y-3 border-t border-zinc-800 pt-6 px-4">
                <button
                    type="button"
                    className={`${navBase} w-full ${navInactive} border border-transparent`}
                    onClick={() => {}}
                >
                    <BarsIcon className={iconClass} aria-hidden />
                    Settings
                </button>
                <button
                    type="button"
                    className={`${navBase} w-full ${navInactive}`}
                    onClick={handleLogout}
                >
                    <ArrowRightIcon className={iconClass} aria-hidden />
                    Sign out
                </button>
            </div>
        </div>
    );
}

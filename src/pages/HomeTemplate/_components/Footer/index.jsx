import { NavLink } from "react-router-dom";
import { SITE_NAME } from "@constants";

const footerLinkClass = ({ isActive }) =>
    [
        "me-4 md:me-6",
        isActive
            ? "text-red-600 underline"
            : "text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-600",
    ].join(" ");

const footerLinkClassLast = ({ isActive }) =>
    [
        isActive
            ? "text-red-600 underline"
            : "text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-600",
    ].join(" ");

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-[90] w-full border-t border-slate-200 bg-white/95 p-4 text-sm font-medium shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/95 md:flex md:items-center md:justify-between md:p-6">
            <span className="text-slate-600 sm:text-center dark:text-slate-400">
                © {year}{" "}
                <NavLink to="/" end className="text-red-600 hover:underline">
                    {SITE_NAME}
                </NavLink>
            </span>
            <ul className="mt-3 flex flex-wrap items-center text-sm font-medium sm:mt-0">
                <li>
                    <NavLink to="/about-us" className={footerLinkClass} end>
                        Về chúng tôi
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/privacy-policy" className={footerLinkClass} end>
                        Chính sách bảo mật
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/terms-of-service" className={footerLinkClass} end>
                        Điều khoản dịch vụ
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className={footerLinkClassLast} end>
                        Liên hệ
                    </NavLink>
                </li>
            </ul>
        </footer>
    );
}

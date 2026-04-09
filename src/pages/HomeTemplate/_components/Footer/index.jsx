import { NavLink } from "react-router-dom";

const footerLinkClass = ({ isActive }) =>
    [
        "me-4 md:me-6",
        isActive ? "text-red-600 underline" : "text-slate-400 hover:text-red-600",
    ].join(" ");

const footerLinkClassLast = ({ isActive }) =>
    [isActive ? "text-red-600 underline" : "text-slate-400 hover:text-red-600"].join(" ");

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-[90] w-full border-t border-white/10 bg-slate-950/95 p-4 text-sm font-medium shadow-sm backdrop-blur-sm md:flex md:items-center md:justify-between md:p-6">
            <span className="text-slate-400 sm:text-center">
                © {year}{" "}
                <NavLink to="/" end className="text-red-600 hover:underline">
                    Movie Booking
                </NavLink>
            </span>
            <ul className="mt-3 flex flex-wrap items-center text-sm font-medium sm:mt-0">
                <li>
                    <NavLink to="/about-us" className={footerLinkClass} end>
                        About us
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/privacy-policy" className={footerLinkClass} end>
                        Privacy policy
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/terms-of-service" className={footerLinkClass} end>
                        Terms of service
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className={footerLinkClassLast} end>
                        Contact
                    </NavLink>
                </li>
            </ul>
        </footer>
    );
}

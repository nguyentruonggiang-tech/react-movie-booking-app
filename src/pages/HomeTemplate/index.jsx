import { Outlet, useLocation } from "react-router-dom";
import Header from "./_components/Header";
import { HOME_MAIN_PADDING_TOP_CLASS } from "./constants";
import Footer from "./_components/Footer";

/** Movie detail uses a full-viewport poster backdrop; opaque shell bg would hide it. */
function isMovieDetailPathname(pathname) {
    return /^\/detail\/[^/]+\/?$/.test(pathname);
}

export default function HomeTemplate() {
    const location = useLocation();
    const homeShellBackgroundClass = isMovieDetailPathname(location.pathname)
        ? "bg-transparent"
        : "bg-slate-950";

    return (
        <div
            className={`flex min-h-screen flex-col ${homeShellBackgroundClass} text-slate-100 antialiased`}
        >
            <Header />

            <main className={`flex-1 pb-32 md:pb-28 ${HOME_MAIN_PADDING_TOP_CLASS}`}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

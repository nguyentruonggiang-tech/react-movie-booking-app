import { SITE_NAME } from "@constants";

export default function Footer() {
    return (
        <footer className="border-t border-rose-950/40 bg-zinc-900/50 px-6 py-5 text-xs text-zinc-500 lg:px-8">
            <div>
                <p className="text-base font-semibold uppercase tracking-wide text-rose-500 sm:text-lg">
                    {SITE_NAME}
                </p>
                <p className="mt-1 text-zinc-500">
                    © {new Date().getFullYear()} Hệ thống đặt vé xem phim.
                </p>
            </div>
        </footer>
    );
}

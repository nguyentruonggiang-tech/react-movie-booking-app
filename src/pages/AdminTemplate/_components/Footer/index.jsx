import { SITE_NAME } from "@constants";

export default function Footer() {
    return (
        <footer className="border-t border-rose-200/80 bg-zinc-50/90 px-6 py-5 text-xs text-zinc-600 dark:border-rose-950/40 dark:bg-zinc-900/50 dark:text-zinc-500 lg:px-8">
            <div>
                <p className="text-base font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-500 sm:text-lg">
                    {SITE_NAME}
                </p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-500">
                    © {new Date().getFullYear()} Hệ thống đặt vé xem phim.
                </p>
            </div>
        </footer>
    );
}

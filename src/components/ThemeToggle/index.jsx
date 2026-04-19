import { useDispatch } from "react-redux";
import { useAppTheme } from "@/hooks/useAppTheme";
import { setPref } from "@/store/themeSlice";

function SunIcon({ className = "h-4 w-4" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function MoonIcon({ className = "h-4 w-4" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
            <path
                d="M21 14.5A8.5 8.5 0 0 1 9.5 3a8.5 8.5 0 1 0 11.5 11.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function ThemeToggle({ compact = false, className = "", variant = "default" }) {
    const dispatch = useDispatch();
    const mode = useAppTheme();
    const isDark = mode === "dark";

    const size = compact ? "h-8 w-8" : "h-9 w-9";
    const base =
        `inline-flex ${size} shrink-0 items-center justify-center rounded-lg border transition-colors ` +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 [-webkit-tap-highlight-color:transparent]";
    const defaultBtn =
        `${base} border-slate-300 bg-slate-100/90 text-slate-700 hover:bg-white hover:text-slate-900 ` +
        "dark:border-white/15 dark:bg-slate-900/60 dark:text-amber-200 dark:hover:bg-white/10 dark:hover:text-amber-100";
    const onDarkPanelBtn =
        `${base} border-white/15 bg-zinc-950/50 text-zinc-200 hover:bg-white/10 hover:text-white ` +
        "dark:border-white/10 dark:bg-black/25 dark:text-amber-200";

    const btnClass = `${variant === "onDarkPanel" ? onDarkPanelBtn : defaultBtn} ${className}`.trim();

    const label = isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối";

    return (
        <button
            type="button"
            className={btnClass}
            onClick={() => dispatch(setPref(isDark ? "light" : "dark"))}
            title={label}
            aria-label={label}
            aria-pressed={isDark}
        >
            {isDark ? (
                <SunIcon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
            ) : (
                <MoonIcon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
            )}
        </button>
    );
}

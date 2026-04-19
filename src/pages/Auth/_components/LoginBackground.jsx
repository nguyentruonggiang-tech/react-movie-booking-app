import loginBackgroundUrl from "@/assets/login-background-placeholder.jpg";

export default function LoginBackground({ className = "" }) {
    return (
        <div
            className={`absolute inset-0 min-h-full w-full overflow-hidden bg-slate-200 bg-cover bg-center bg-no-repeat dark:bg-slate-950 ${className}`}
            style={{ backgroundImage: `url(${loginBackgroundUrl})` }}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/55 via-slate-200/65 to-slate-400/80 dark:from-black/35 dark:via-black/45 dark:to-black/80"
                aria-hidden
            />
        </div>
    );
}

import loginBackgroundUrl from "@/assets/login-background-placeholder.jpg";

export default function LoginBackground({ className = "" }) {
    return (
        <div
            className={`absolute inset-0 min-h-full w-full overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat ${className}`}
            style={{ backgroundImage: `url(${loginBackgroundUrl})` }}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-black/45 to-black/80"
                aria-hidden
            />
        </div>
    );
}

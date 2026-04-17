import { NavLink } from "react-router-dom";

export default function NotFound({
    title,
    message = "",
    backHref = "/admin",
    backLabel = "Back to admin",
}) {
    return (
        <div className="relative z-20 flex w-full items-center justify-center bg-transparent px-8 py-12">
            <div className="mx-auto w-full max-w-2xl rounded-xl border border-zinc-700/80 bg-zinc-900/50 px-6 py-10 text-center">
                <h1 className="text-xl font-bold text-white">{title}</h1>
                {message ? (
                    <p className="mt-3 text-sm text-zinc-400">{message}</p>
                ) : null}
                <NavLink
                    to={backHref}
                    className="mt-8 inline-flex rounded-full bg-rose-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
                >
                    {backLabel}
                </NavLink>
            </div>
        </div>
    );
}

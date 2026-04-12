import { NavLink } from "react-router-dom";

export default function NotFound({ title, message = "" }) {
    return (
        <div className="relative z-20 flex w-full items-center justify-center bg-transparent px-8 py-12">
            <div className="mx-auto w-full max-w-2xl rounded-xl border border-white/10 bg-zinc-900/50 px-6 py-10 text-center">
                <h1 className="text-xl font-bold text-white">{title}</h1>
                {message ? (
                    <p className="mt-3 text-sm text-zinc-400">{message}</p>
                ) : null}
                <NavLink
                    to="/"
                    className="mt-8 inline-flex rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                    Back to Home
                </NavLink>
            </div>
        </div>
    );
}

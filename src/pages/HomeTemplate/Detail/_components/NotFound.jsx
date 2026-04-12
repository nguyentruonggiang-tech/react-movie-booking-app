import { NavLink } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-slate-950">
            <div className="mx-auto max-w-7xl px-8 py-16 text-center">
                <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-zinc-900/50 px-6 py-10">
                    <h1 className="text-xl font-bold text-white">
                        Movie not found
                    </h1>

                    <p className="mt-3 text-sm text-zinc-400">
                        No movie data was returned for this id.
                    </p>

                    <NavLink
                        to="/"
                        className="mt-8 inline-flex rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                    >
                        Back to Home
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
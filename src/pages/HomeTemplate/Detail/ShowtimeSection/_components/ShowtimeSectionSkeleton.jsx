import { SHOWTIME_COLUMN_CLASS } from "../constants";

export default function ShowtimeSectionSkeleton() {
    return (
        <section
            className="relative z-10 mx-auto mt-10 w-full min-w-0 max-w-7xl overflow-x-hidden px-8 pb-6 md:pb-8"
            aria-labelledby="movie-showtimes-heading"
            aria-busy="true"
            aria-live="polite"
        >
            <h2
                id="movie-showtimes-heading"
                className="mb-8 text-4xl font-black uppercase tracking-tight text-white"
            >
                Showtimes
            </h2>

            <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[96px_minmax(0,1fr)] lg:items-stretch">
                <div className="min-w-0">
                    <div className={`${SHOWTIME_COLUMN_CLASS} p-3`}>
                        <div className="theater-scrollbar h-full space-y-3 overflow-y-auto overflow-x-hidden pr-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="mx-auto flex h-14 w-14 shrink-0 animate-pulse items-center justify-center rounded-lg border border-white/10 bg-zinc-800"
                                >
                                    <div className="h-10 w-10 rounded bg-zinc-700/70" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="min-h-0 min-w-0 w-full max-w-full overflow-x-hidden">
                    <div
                        className={`${SHOWTIME_COLUMN_CLASS} flex flex-col p-4`}
                    >
                        <header className="shrink-0 space-y-3 border-b border-white/10 pb-3">
                            <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
                                {Array.from({ length: 7 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex min-w-[4.5rem] shrink-0 animate-pulse flex-col items-center gap-2 rounded-lg bg-zinc-800/80 px-3 py-2"
                                    >
                                        <div className="h-3 w-7 rounded bg-zinc-700" />
                                        <div className="h-5 w-10 rounded bg-zinc-700" />
                                    </div>
                                ))}
                            </div>
                        </header>

                        <div className="min-h-0 flex-1 overflow-hidden pt-3">
                            <div className="theater-scrollbar h-full overflow-y-auto overflow-x-hidden pr-1">
                                <div className="space-y-0 divide-y divide-white/10">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <article
                                            key={index}
                                            className="py-4 first:pt-0"
                                        >
                                            <div className="flex gap-4">
                                                <div className="h-16 w-16 shrink-0 animate-pulse overflow-hidden rounded-lg border border-white/10 bg-zinc-800" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="h-4 w-full max-w-[12rem] animate-pulse rounded bg-zinc-800" />
                                                    <div className="mt-2 h-3 max-w-md animate-pulse rounded bg-zinc-800/70" />
                                                    <div className="mt-2 h-3 max-w-sm animate-pulse rounded bg-zinc-800/60" />
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {Array.from({
                                                            length: 5,
                                                        }).map((__, chipIndex) => (
                                                            <div
                                                                key={chipIndex}
                                                                className="h-8 w-[4.5rem] animate-pulse rounded-lg border border-white/10 bg-zinc-800/70"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

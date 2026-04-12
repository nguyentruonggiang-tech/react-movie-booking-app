export default function Loading() {
    return (
        <section className="relative z-10 mx-auto mt-10 max-w-7xl px-8 pb-6 md:pb-8">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111318]/90 shadow-xl">
                <div className="border-b border-white/10 px-6 py-4">
                    <div className="h-7 w-36 animate-pulse rounded bg-zinc-800" />
                    <div className="mt-2 h-4 w-56 animate-pulse rounded bg-zinc-800/70" />
                </div>

                <div className="grid min-h-[500px] grid-cols-1 lg:grid-cols-[96px_1fr]">
                    <div className="border-r border-white/10 bg-[#0f1115] px-2 py-3">
                        <div className="flex flex-col items-center gap-3">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-zinc-800"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#161a20] px-5 py-5">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="border-b border-white/10 py-5 last:border-b-0"
                            >
                                <div className="flex gap-4">
                                    <div className="hidden h-16 w-16 animate-pulse rounded-md bg-zinc-800 sm:block" />
                                    <div className="flex-1">
                                        <div className="h-4 w-48 animate-pulse rounded bg-zinc-800" />
                                        <div className="mt-2 h-3 w-64 animate-pulse rounded bg-zinc-800/70" />
                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {Array.from({ length: 4 }).map((_, timeIndex) => (
                                                <div
                                                    key={timeIndex}
                                                    className="h-10 w-20 animate-pulse rounded-md bg-zinc-800/80"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
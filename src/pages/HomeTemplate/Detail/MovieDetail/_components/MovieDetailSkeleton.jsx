export default function MovieDetailSkeleton() {
    return (
        <div
            className="min-h-screen w-full bg-[#0c0e12]"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="mx-auto max-w-7xl px-8 pb-16 pt-4 md:pb-24">
                <div className="mb-6 border-b border-white/10 pb-4">
                    <div className="h-4 w-56 max-w-full animate-pulse rounded bg-zinc-800" />
                </div>

                <div className="flex animate-pulse flex-col gap-8 lg:flex-row lg:gap-10">
                    <div className="mx-auto w-full max-w-[180px] shrink-0 lg:mx-0 lg:max-w-[220px]">
                        <div className="aspect-[2/3] rounded-lg bg-zinc-800" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-4">
                        <div className="h-8 w-4/5 rounded-lg bg-zinc-800" />
                        <div className="flex flex-wrap gap-3">
                            <div className="h-6 w-24 rounded-md bg-zinc-800" />
                            <div className="h-6 w-20 rounded-full bg-zinc-800/90" />
                            <div className="h-6 w-16 rounded-full bg-zinc-800/90" />
                        </div>
                        <div className="h-4 w-32 rounded bg-zinc-800/90" />
                        <div className="h-4 w-full max-w-xl rounded bg-zinc-800/70" />
                        <div className="h-4 w-full max-w-lg rounded bg-zinc-800/60" />
                        <div className="h-4 w-full max-w-md rounded bg-zinc-800/50" />
                    </div>
                </div>
            </div>
        </div>
    );
}

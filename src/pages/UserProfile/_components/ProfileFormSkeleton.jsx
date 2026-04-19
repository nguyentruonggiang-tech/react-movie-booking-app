export default function ProfileFormSkeleton() {
    return (
        <div
            className="animate-pulse rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/80"
            aria-hidden
        >
            <div className="flex gap-6 border-b border-zinc-200 pb-6 dark:border-zinc-800">
                <div className="h-20 w-20 shrink-0 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex-1 space-y-2 pt-2">
                    <div className="h-7 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
            </div>
            <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-10 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ColumnSkeleton({
    count = 5,
    itemClassName = "h-20",
    wrapperClassName = "p-4",
    containerClassName = "h-[640px] max-h-[640px]",
}) {
    return (
        <div
            className={`${containerClassName} w-full max-w-full min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-none ${wrapperClassName}`}
        >
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={`rounded-lg bg-slate-200 animate-pulse dark:bg-zinc-800 ${itemClassName}`}
                    />
                ))}
            </div>
        </div>
    );
}
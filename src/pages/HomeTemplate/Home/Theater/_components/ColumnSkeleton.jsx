export default function ColumnSkeleton({
    count = 5,
    itemClassName = "h-20",
    wrapperClassName = "p-4",
    containerClassName = "h-[640px] max-h-[640px]",
}) {
    return (
        <div
            className={`${containerClassName} rounded-xl border border-white/10 bg-zinc-900/60 ${wrapperClassName}`}
        >
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={`rounded-lg bg-zinc-800 animate-pulse ${itemClassName}`}
                    />
                ))}
            </div>
        </div>
    );
}
import { ChevronLeft, ChevronRight } from "flowbite-react-icons/outline";

export default function Pagination({
    rangeStart,
    rangeEnd,
    totalCount,
    currentPage,
    totalPages,
    loading,
    onPrevious,
    onNext,
    itemLabel = "mục",
    rangeSummary = null,
    className = "",
}) {
    const rootClassName = [
        "flex flex-col items-center justify-between gap-4 border-t border-zinc-700/50 bg-zinc-800 px-4 py-3 text-sm sm:flex-row",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={rootClassName}>
            {rangeSummary ? (
                <p className="text-zinc-500">{rangeSummary}</p>
            ) : (
                <p className="text-zinc-500">
                    Hiển thị{" "}
                    <span className="font-medium tabular-nums text-white">
                        {rangeStart}–{rangeEnd}
                    </span>{" "}
                    trong tổng{" "}
                    <span className="font-medium tabular-nums text-white">{totalCount}</span>{" "}
                    {itemLabel}
                </p>
            )}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={currentPage <= 1 || loading}
                    onClick={onPrevious}
                    className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition enabled:hover:border-rose-500 enabled:hover:text-rose-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Trang trước"
                >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <span className="text-zinc-500">
                    Trang{" "}
                    <span className="font-medium tabular-nums text-white">{currentPage}</span> /{" "}
                    <span className="font-medium tabular-nums text-white">{totalPages}</span>
                </span>
                <button
                    type="button"
                    disabled={currentPage >= totalPages || loading}
                    onClick={onNext}
                    className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition enabled:hover:border-rose-500 enabled:hover:text-rose-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Trang sau"
                >
                    <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
            </div>
        </div>
    );
}

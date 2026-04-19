export default function TheaterClusterList({
    theaterClusters,
    selectedClusterCode,
    onSelectCluster,
}) {
    return (
        <div className="h-[640px] max-h-[640px] w-full max-w-full min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-none">
            <div className="theater-scrollbar h-full overflow-y-auto overflow-x-hidden pr-1">
                <div className="space-y-3">
                    {theaterClusters.map((item, index) => {
                        const isActive = item.maCumRap === selectedClusterCode;

                        return (
                            <button
                                key={item.maCumRap || index}
                                type="button"
                                onClick={() => onSelectCluster(item.maCumRap)}
                                className={`w-full cursor-pointer rounded-lg border p-3 text-left transition ${
                                    isActive
                                        ? "border-red-500 bg-red-50 dark:bg-red-600/10"
                                        : "border-slate-200 bg-slate-50 hover:border-red-400 dark:border-white/10 dark:bg-zinc-800/80 dark:hover:border-red-500"
                                }`}
                            >
                                <p className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-white">
                                    {item.tenCumRap}
                                </p>

                                <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-zinc-400">
                                    {item.diaChi}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
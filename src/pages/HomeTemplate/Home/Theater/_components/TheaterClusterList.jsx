export default function TheaterClusterList({
    theaterClusters,
    selectedClusterCode,
    onSelectCluster,
}) {
    return (
        <div className="h-[640px] max-h-[640px] rounded-xl border border-white/10 bg-zinc-900/60 p-4">
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
                                        ? "border-red-500 bg-red-600/10"
                                        : "border-white/10 bg-zinc-800/80 hover:border-red-500"
                                }`}
                            >
                                <p className="line-clamp-1 text-sm font-bold text-white">
                                    {item.tenCumRap}
                                </p>

                                <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
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
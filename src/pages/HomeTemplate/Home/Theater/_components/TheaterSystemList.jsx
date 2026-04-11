export default function TheaterSystemList({
    theaterSystems,
    selectedSystemCode,
    onSelectSystem,
}) {
    return (
        <div className="h-[640px] max-h-[640px] rounded-xl border border-white/10 bg-zinc-900/60 p-3">
            <div className="theater-scrollbar h-full space-y-3 overflow-y-auto overflow-x-hidden pr-1">
                {theaterSystems.map((item, index) => {
                    const isActive = item.maHeThongRap === selectedSystemCode;

                    return (
                        <button
                            key={item.maHeThongRap || index}
                            type="button"
                            onClick={() => onSelectSystem(item.maHeThongRap)}
                            className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border transition ${
                                isActive
                                    ? "border-red-500 bg-red-600/20"
                                    : "border-white/10 bg-zinc-800 hover:border-red-500"
                            }`}
                            title={item.tenHeThongRap}
                        >
                            <img
                                src={
                                    item.logo ||
                                    "https://placehold.co/56x56/18181b/e4e4e7?text=C"
                                }
                                alt={item.tenHeThongRap}
                                className="h-10 w-10 object-contain"
                                loading="lazy"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
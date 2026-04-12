import { memo } from "react";

import { SHOWTIME_COLUMN_CLASS } from "../constants";
import ShowtimeVerifiedImg from "./ShowtimeVerifiedImg";

function TheaterSystemRail({
    theaterSystems,
    activeTheaterSystemCode,
    onSelectTheaterSystem,
}) {
    return (
        <div className="min-w-0">
            <div className={`${SHOWTIME_COLUMN_CLASS} p-3`}>
                <div className="theater-scrollbar h-full space-y-3 overflow-y-auto overflow-x-hidden pr-1">
                    {theaterSystems.map((system) => {
                        const isActive =
                            system.maHeThongRap === activeTheaterSystemCode;

                        return (
                            <button
                                key={system.maHeThongRap}
                                type="button"
                                onClick={() =>
                                    onSelectTheaterSystem(system.maHeThongRap)
                                }
                                className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border transition ${
                                    isActive
                                        ? "border-red-500 bg-red-600/20"
                                        : "border-white/10 bg-zinc-800 hover:border-red-500"
                                }`}
                                title={system.tenHeThongRap}
                            >
                                <ShowtimeVerifiedImg
                                    rawUrl={system.logo}
                                    alt={system.tenHeThongRap}
                                    className="h-10 w-10 object-contain"
                                    loading="lazy"
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default memo(TheaterSystemRail);

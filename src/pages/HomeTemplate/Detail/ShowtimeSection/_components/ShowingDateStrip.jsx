import { memo } from "react";

import { WEEKDAY_LABELS_EN } from "../constants";

function ShowingDateStrip({
    sortedShowingDateKeys,
    activeShowingDateKey,
    onSelectShowingDateKey,
}) {
    return (
        <header className="shrink-0 space-y-3 border-b border-white/10 pb-3">
            <div className="-mx-1 flex gap-1 overflow-x-auto pb-1 gap-2">
                {!sortedShowingDateKeys.length && (
                    <p className="px-1 py-2 text-sm text-zinc-500">
                        No showtimes for this chain.
                    </p>
                )}
                {sortedShowingDateKeys.map((dateKey) => {
                    const dateObj = new Date(`${dateKey}T12:00:00`);
                    const isActive = dateKey === activeShowingDateKey;
                    const weekdayLabel = WEEKDAY_LABELS_EN[dateObj.getDay()];
                    const dayOfMonth = dateObj.getDate();
                    const monthNum = dateObj.getMonth() + 1;

                    return (
                        <button
                            key={dateKey}
                            type="button"
                            onClick={() => onSelectShowingDateKey(dateKey)}
                            className={`flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-lg p-2 text-center transition border cursor-pointer ${
                                isActive
                                    ? "text-red-500 border-red-500"
                                    : "text-zinc-300 border-white/10 hover:border-red-500 hover:bg-zinc-800/80"
                            }`}
                        >
                            <span
                                className={`text-xs font-medium leading-tight ${
                                    isActive
                                        ? "text-red-500"
                                        : "text-white"
                                }`}
                            >
                                {weekdayLabel}
                            </span>
                            <span
                                className={`text-lg font-bold tabular-nums ${
                                    isActive
                                        ? "text-red-500"
                                        : "text-white"
                                }`}
                            >
                                {dayOfMonth}/{monthNum}
                            </span>
                        </button>
                    );
                })}
            </div>
        </header>
    );
}

export default memo(ShowingDateStrip);

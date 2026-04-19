import { memo } from "react";

import { WEEKDAY_LABELS_VI } from "../constants";

function ShowingDateStrip({
    sortedShowingDateKeys,
    activeShowingDateKey,
    onSelectShowingDateKey,
}) {
    return (
        <header className="shrink-0 space-y-3 border-b border-slate-200 pb-3 dark:border-white/10">
            <div className="-mx-1 flex gap-1 overflow-x-auto pb-1 gap-2">
                {!sortedShowingDateKeys.length && (
                    <p className="px-1 py-2 text-sm text-slate-500 dark:text-zinc-500">
                        Chuỗi rạp này chưa có suất chiếu.
                    </p>
                )}
                {sortedShowingDateKeys.map((dateKey) => {
                    const dateObj = new Date(`${dateKey}T12:00:00`);
                    const isActive = dateKey === activeShowingDateKey;
                    const weekdayLabel = WEEKDAY_LABELS_VI[dateObj.getDay()];
                    const dayOfMonth = dateObj.getDate();
                    const monthNum = dateObj.getMonth() + 1;

                    return (
                        <button
                            key={dateKey}
                            type="button"
                            onClick={() => onSelectShowingDateKey(dateKey)}
                            className={`flex min-w-[4.5rem] shrink-0 cursor-pointer flex-col items-center rounded-lg border p-2 text-center transition ${
                                isActive
                                    ? "border-red-500 text-red-500"
                                    : "border-slate-200 text-slate-700 hover:border-red-400 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-300 dark:hover:border-red-500 dark:hover:bg-zinc-800/80"
                            }`}
                        >
                            <span
                                className={`text-xs font-medium leading-tight ${
                                    isActive
                                        ? "text-red-500"
                                        : "text-slate-800 dark:text-white"
                                }`}
                            >
                                {weekdayLabel}
                            </span>
                            <span
                                className={`text-lg font-bold tabular-nums ${
                                    isActive
                                        ? "text-red-500"
                                        : "text-slate-900 dark:text-white"
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

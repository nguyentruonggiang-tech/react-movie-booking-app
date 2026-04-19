import { Clock } from "flowbite-react-icons/outline";
import { showtimeLabel } from "@pages/HomeTemplate/Detail/ShowtimeSection/utils";
import { formatDateDisplay } from "@utils/dateUtils";
import { clusterRoomLine } from "../utils";
import { errTextClass } from "./constants";

export default function DayScheduleList({
    ngayChieu,
    scheduleLoading,
    scheduleError,
    sessionsForSelectedDay,
    selectedDayLabel,
}) {
    return (
        <section
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-left text-zinc-900 shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:shadow-lg"
            aria-labelledby="admin-showtime-day-schedule-heading"
        >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-700">
                <div className="flex min-w-0 items-center gap-2">
                    <Clock
                        className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400"
                        aria-hidden
                    />
                    <h2
                        id="admin-showtime-day-schedule-heading"
                        className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white"
                    >
                        Lịch chiếu trong ngày
                    </h2>
                </div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{selectedDayLabel}</p>
            </div>

            {!String(ngayChieu ?? "").trim() ? (
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
                    Chọn ngày chiếu ở form để lọc suất chiếu cùng ngày.
                </p>
            ) : scheduleLoading ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-500">Đang tải lịch chiếu…</p>
            ) : scheduleError ? (
                <p className={`text-xs ${errTextClass}`}>{scheduleError}</p>
            ) : sessionsForSelectedDay.length === 0 ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Không có suất nào khớp ngày{" "}
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        {formatDateDisplay(ngayChieu) || ngayChieu}
                    </span>
                    .
                </p>
            ) : (
                <ul className="max-h-72 space-y-3 overflow-y-auto pr-0.5 text-left">
                    {sessionsForSelectedDay.map((row) => {
                        const s = row.session;
                        const key = s?.maLichChieu ?? `${row.maCumRap}-${s?.ngayChieuGioChieu}`;
                        const hasTime =
                            s?.ngayChieuGioChieu &&
                            !Number.isNaN(new Date(s.ngayChieuGioChieu).getTime());
                        const timeLabel = hasTime ? showtimeLabel(s.ngayChieuGioChieu) : "—";
                        const systemTitle = String(row.tenHeThongRap ?? "").trim() || "—";
                        const clusterRoomText = clusterRoomLine(row, s);
                        return (
                            <li
                                key={String(key)}
                                className="grid grid-cols-[5.25rem_minmax(0,1fr)] items-stretch overflow-hidden rounded-lg border border-zinc-300 bg-white text-left shadow-md dark:border-zinc-700 dark:bg-[#141416] dark:shadow-lg dark:shadow-black/30"
                            >
                                <div className="flex flex-col items-center justify-center gap-2 border-r border-zinc-200/90 bg-gradient-to-b from-rose-50 to-rose-100/80 px-2 py-4 text-center dark:border-zinc-600/80 dark:from-rose-950/40 dark:to-rose-950/10">
                                    <span className="block text-xl font-bold tabular-nums leading-tight tracking-tight text-rose-950 dark:text-rose-100">
                                        {timeLabel}
                                    </span>
                                    <span className="block text-[10px] font-semibold uppercase leading-normal tracking-[0.12em] text-rose-800/80 dark:text-rose-300/80">
                                        BẮT ĐẦU
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-col justify-center bg-white px-4 py-3.5 dark:bg-[#1a1a1d]">
                                    <p className="text-sm font-bold leading-snug text-zinc-900 dark:text-white">
                                        {systemTitle}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                                        {clusterRoomText}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

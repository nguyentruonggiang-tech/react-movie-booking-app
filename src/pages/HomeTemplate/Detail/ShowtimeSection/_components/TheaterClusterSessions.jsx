import { memo } from "react";
import { NavLink } from "react-router-dom";

import {
    googleMapsSearchUrl,
    sessionsForDay,
    showtimeLabel,
} from "../utils";
import ShowtimeVerifiedImg from "./ShowtimeVerifiedImg";

function TheaterClusterSessions({
    theaterClusters,
    activeShowingDateKey,
    activeTheaterSystemCode,
    activeTheaterSystem,
}) {
    return (
        <div className="min-h-0 flex-1 overflow-hidden pt-3">
            <div className="theater-scrollbar h-full overflow-y-auto overflow-x-hidden pr-1">
                <div className="space-y-0 divide-y divide-slate-200 dark:divide-white/10">
                    {theaterClusters.map((cluster) => {
                        const sessionsOnActiveDate = sessionsForDay(
                            cluster.lichChieuPhim,
                            activeShowingDateKey,
                        );
                        return (
                            <article
                                key={cluster.maCumRap}
                                className="py-4 first:pt-0"
                            >
                                <div className="flex gap-4">
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 p-2 dark:border-white/10 dark:bg-zinc-800">
                                        <ShowtimeVerifiedImg
                                            key={`${cluster.maCumRap}-${activeTheaterSystemCode}`}
                                            rawUrl={cluster.hinhAnh}
                                            fallbackRawUrl={
                                                activeTheaterSystem?.logo
                                            }
                                            alt={cluster.tenCumRap}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
                                            {cluster.tenCumRap}
                                        </h3>
                                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                            {cluster.diaChi}{" "}
                                            <a
                                                href={googleMapsSearchUrl(
                                                    cluster.diaChi,
                                                )}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-semibold text-red-500 hover:underline"
                                            >
                                                [Bản đồ]
                                            </a>
                                        </p>

                                        <div className="mt-3">
                                            {sessionsOnActiveDate.length ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {sessionsOnActiveDate.map(
                                                        (session) => (
                                                            <NavLink
                                                                key={
                                                                    session.maLichChieu
                                                                }
                                                                to={`/ticketroom/${session.maLichChieu}`}
                                                                className="rounded-lg border border-emerald-600/40 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                                                            >
                                                                {showtimeLabel(
                                                                    session.ngayChieuGioChieu,
                                                                )}
                                                            </NavLink>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500 dark:text-zinc-500">
                                                    Không có suất chiếu vào ngày
                                                    này.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}

                    {!theaterClusters.length && (
                        <p className="py-6 text-sm text-slate-500 dark:text-zinc-500">
                            Chuỗi rạp này chưa có cụm rạp.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(TheaterClusterSessions);

import MovieCard from "./MovieCard";
import ColumnEmpty from "./ColumnEmpty";

function trimText(value) {
    if (value == null) return "";
    return typeof value === "string" ? value.trim() : String(value).trim();
}

function ClusterHeading({ clusterName, clusterAddress }) {
    const name = trimText(clusterName);
    const address = trimText(clusterAddress);
    if (name === "" && address === "") return null;

    return (
        <header className="mb-3 shrink-0 border-b border-slate-200 pb-3 dark:border-white/10">
            {name !== "" ? (
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 dark:text-white">
                    {name}
                </h3>
            ) : null}
            {address !== "" ? (
                <p
                    className={`line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400 ${
                        name !== "" ? "mt-2" : ""
                    }`}
                >
                    {address}
                </p>
            ) : null}
        </header>
    );
}

export default function ShowtimeList({ movies, clusterName, clusterAddress }) {
    if (movies.length === 0) {
        return (
            <div className="flex h-[640px] max-h-[640px] w-full max-w-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-none">
                <ClusterHeading
                    clusterName={clusterName}
                    clusterAddress={clusterAddress}
                />
                <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center">
                    <ColumnEmpty
                        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-10 text-center dark:border-white/10 dark:bg-zinc-900/40"
                        description="Không có suất chiếu cho cụm rạp này."
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[640px] max-h-[640px] w-full max-w-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-none">
            <ClusterHeading
                clusterName={clusterName}
                clusterAddress={clusterAddress}
            />
            <div className="min-h-0 flex-1 overflow-hidden">
                <div className="theater-scrollbar h-full overflow-y-auto overflow-x-hidden pr-1">
                    <div className="space-y-4 pb-1">
                        {movies.slice(0, 10).map((movie, index) => (
                            <MovieCard
                                key={`movie-showtime-${movie?.maPhim || index}`}
                                movie={movie}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
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
        <header className="mb-3 shrink-0 border-b border-white/10 pb-3">
            {name !== "" ? (
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-white">
                    {name}
                </h3>
            ) : null}
            {address !== "" ? (
                <p
                    className={`line-clamp-3 text-sm leading-relaxed text-zinc-400 ${
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
            <div className="flex h-[640px] max-h-[640px] w-full max-w-full min-w-0 flex-col rounded-xl border border-white/10 bg-zinc-900/60 p-4">
                <ClusterHeading
                    clusterName={clusterName}
                    clusterAddress={clusterAddress}
                />
                <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center">
                    <ColumnEmpty
                        className="rounded-lg border border-white/10 bg-zinc-900/40 px-4 py-10 text-center"
                        description="Không có suất chiếu cho cụm rạp này."
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[640px] max-h-[640px] w-full max-w-full min-w-0 flex-col rounded-xl border border-white/10 bg-zinc-900/60 p-4">
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
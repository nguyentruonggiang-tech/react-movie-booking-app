import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBox from "@pages/HomeTemplate/_components/ErrorBox";
import NotFound from "@pages/HomeTemplate/_components/NotFound";
import { fetchMovieList } from "./slice";
import MovieCard from "./_components/MovieCard";

const TAB_PLAYING = "playing";
const TAB_UPCOMING = "upcoming";

function moviesForTab(movies, tab) {
    const playing = movies.filter((m) => m.dangChieu === true);
    const upcoming = movies.filter((m) => m.sapChieu === true);
    if (tab === TAB_PLAYING) {
        return playing.length > 0 ? playing : movies;
    }
    return upcoming;
}

function MovieListSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={`sk-${i}`} className="animate-pulse">
                    <div className="aspect-[2/3] rounded-xl bg-zinc-800" />
                    <div className="mt-6 h-6 w-3/4 rounded bg-zinc-800" />
                    <div className="mt-2 h-4 w-full rounded bg-zinc-800/80" />
                </div>
            ))}
        </div>
    );
}

export default function MovieList() {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.movieReducer);

    const movies = useMemo(() => {
        return Array.isArray(data) ? data : [];
    }, [data]);

    const refetch = useCallback(() => {
        dispatch(fetchMovieList());
    }, [dispatch]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const [tab, setTab] = useState(TAB_PLAYING);

    const visible = useMemo(() => moviesForTab(movies, tab), [movies, tab]);

    return (
        <section
            id="movie-list"
            className="mx-auto max-w-7xl px-8 py-6 md:py-8"
            aria-labelledby="movie-list-heading"
        >
            <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
                <div>
                    <h2
                        id="movie-list-heading"
                        className="mb-4 font-sans text-4xl font-black uppercase tracking-tight text-white"
                    >
                        Movie list
                    </h2>
                    <div className="flex gap-8">
                        <button
                            type="button"
                            className={`cursor-pointer font-sans pb-2 text-lg font-bold transition-colors ${
                                tab === TAB_PLAYING
                                    ? "border-b-2 border-red-500 text-red-500"
                                    : "text-zinc-500 hover:text-white"
                            }`}
                            onClick={() => setTab(TAB_PLAYING)}
                        >
                            Now showing
                        </button>
                        <button
                            type="button"
                            className={`cursor-pointer font-sans pb-2 text-lg font-bold transition-colors ${
                                tab === TAB_UPCOMING
                                    ? "border-b-2 border-red-500 text-red-500"
                                    : "text-zinc-500 hover:text-white"
                            }`}
                            onClick={() => setTab(TAB_UPCOMING)}
                        >
                            Coming soon
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <MovieListSkeleton />
            ) : error ? (
                <ErrorBox
                    title="Movie list"
                    message={error}
                    onRetry={refetch}
                />
            ) : visible.length === 0 ? (
                <div className="mx-auto w-full max-w-xl">
                    <NotFound
                        title="Movie list"
                        message={
                            tab === TAB_UPCOMING
                                ? "No upcoming movies yet."
                                : "No movies in the list."
                        }
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {visible.map((movie) => (
                        <MovieCard
                            key={`movie-${movie?.maPhim}`}
                            movie={movie}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

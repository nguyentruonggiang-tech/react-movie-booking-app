import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CalendarMonth, CalendarPlus, Edit, Search, TrashBin } from "flowbite-react-icons/outline";
import ErrorBox from "../_components/ErrorBox";
import NotFound from "../_components/NotFound";
import Pagination from "../_components/Pagination";
import TableSkeleton from "./TableSkeleton";
import { ADMIN_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@constants";
import { fetchFilmList } from "./slice";

/** Renders calendar date as `dd/mm/yyyy` (local timezone). */
function formatReleaseDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatRating(value) {
    if (value == null || value === "") return "—";
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return `${n}/10`;
}

const FILM_LISTING_FLAGS = [
    { field: "hot", label: "Hot" },
    { field: "dangChieu", label: "Now showing" },
    { field: "sapChieu", label: "Coming soon" },
];

export default function Films() {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.fetchFilmsReducer);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedTenPhim, setDebouncedTenPhim] = useState("");

    useEffect(() => {
        const debounceTimeoutId = window.setTimeout(() => {
            const currentTenPhim = searchInput.trim();
            setDebouncedTenPhim((previousTenPhim) => {
                if (previousTenPhim === currentTenPhim) {
                    return previousTenPhim;
                }
                setPage(1);
                return currentTenPhim;
            });
        }, SEARCH_DEBOUNCE_MS);
        return () => window.clearTimeout(debounceTimeoutId);
    }, [searchInput]);

    useEffect(() => {
        dispatch(
            fetchFilmList({
                page,
                pageSize: ADMIN_PAGE_SIZE,
                ...(debouncedTenPhim !== "" ? { tenPhim: debouncedTenPhim } : {}),
            }),
        );
    }, [dispatch, page, debouncedTenPhim]);

    const loadFilmListPage = useCallback(() => {
        dispatch(
            fetchFilmList({
                page,
                pageSize: ADMIN_PAGE_SIZE,
                ...(debouncedTenPhim !== "" ? { tenPhim: debouncedTenPhim } : {}),
            }),
        );
    }, [dispatch, page, debouncedTenPhim]);

    const items = data?.items ?? [];

    const totalCount = data?.totalCount ?? 0;
    const totalPages = Math.max(1, data?.totalPages ?? 1);
    const currentPage = data?.currentPage ?? page;
    const rangeStart =
        totalCount === 0 ? 0 : (currentPage - 1) * ADMIN_PAGE_SIZE + 1;
    const rangeEnd = Math.min(currentPage * ADMIN_PAGE_SIZE, totalCount);
    
    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Film list</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Manage the film library and system showtimes
                    </p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:max-w-md sm:flex-1 sm:justify-end">
                    <Link
                        to="/admin/films/addnew"
                        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-900/30 transition hover:bg-rose-500"
                    >
                        Add Film
                    </Link>
                    <label className="relative block min-w-[200px] flex-1">
                        <span className="sr-only">Search films</span>
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                            aria-hidden
                        />
                        <input
                            type="search"
                            placeholder="Search films…"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950/50 py-2 pl-10 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                    </label>
                </div>
            </div>

            <div className="mt-8">
                {error ? (
                    <ErrorBox
                        title="Could not load film list"
                        message={error}
                        onRetry={loadFilmListPage}
                    />
                ) : null}

                {!error && loading ? (
                    <div className="overflow-hidden rounded-xl border border-zinc-800">
                        <div
                            className="border-b border-zinc-800/80 bg-zinc-800 px-5 py-4"
                            aria-hidden
                        >
                            <div className="h-3 w-48 max-w-full rounded bg-zinc-700/40" />
                        </div>
                        <div className="bg-zinc-900 px-5 py-3">
                            <TableSkeleton />
                        </div>
                    </div>
                ) : null}

                {!error && !loading && items.length === 0 ? (
                    <NotFound
                        title={debouncedTenPhim !== "" ? "No matching films" : "No films"}
                        message={
                            debouncedTenPhim !== ""
                                ? "No films match your search."
                                : "No films on this page."
                        }
                    />
                ) : null}

                {!error && !loading && items.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-zinc-800">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] text-left text-sm">
                                <thead className="bg-zinc-800">
                                    <tr className="border-b border-zinc-800/90">
                                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                            Film
                                        </th>
                                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                            Release date
                                        </th>
                                        <th className="w-14 max-w-14 shrink-0 px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                            Rating
                                        </th>
                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/70 bg-zinc-900">
                                {items.map((film) => (
                                    <tr key={film.maPhim} className="align-middle">
                                        <td className="px-5 py-3 align-top">
                                            <div className="flex items-stretch gap-2">
                                                <Link to={`/admin/films/edit/${film.maPhim}`}>
                                                    <img
                                                        src={film.hinhAnh}
                                                        alt=""
                                                        className="h-12 w-9 shrink-0 self-start rounded object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='48'%3E%3Crect fill='%233f3f46' width='36' height='48'/%3E%3C/svg%3E";
                                                        }}
                                                    />
                                                </Link>
                                          
                                                <div className="flex min-h-12 min-w-0 max-w-[13rem] flex-1 flex-col justify-between gap-1 sm:max-w-[15rem]">
                                                    <Link
                                                        to={`/admin/films/edit/${film.maPhim}`}
                                                        className="line-clamp-2 text-sm font-medium leading-tight text-white hover:text-rose-400"
                                                        title={film.tenPhim}
                                                    >
                                                        {film.tenPhim}
                                                    </Link>
                                               
                                                    <div className="flex flex-wrap gap-1">
                                                        {FILM_LISTING_FLAGS.map(({ field, label }) => {
                                                            const on = Boolean(film[field]);
                                                            return (
                                                                <span
                                                                    key={field}
                                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                                        on
                                                                            ? "bg-rose-600/25 text-rose-200"
                                                                            : "bg-zinc-800/90 text-zinc-500 opacity-80"
                                                                    }`}
                                                                >
                                                                    {label}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-zinc-300">
                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarMonth
                                                    className="h-4 w-4 shrink-0 text-rose-500"
                                                    aria-hidden
                                                />
                                                {formatReleaseDate(film.ngayKhoiChieu)}
                                            </span>
                                        </td>
                                        <td className="w-14 max-w-14 shrink-0 whitespace-nowrap px-5 py-3 text-center tabular-nums text-zinc-200">
                                            {formatRating(film.danhGia)}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex flex-wrap items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/films/edit/${film.maPhim}`}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-zinc-800/70 hover:text-rose-400"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4 shrink-0" aria-hidden />
                                                </Link>
                                                <button
                                                    type="button"
                                                    title="Delete"
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-zinc-800/70 hover:text-red-400"
                                                    onClick={() =>
                                                        toast.info(
                                                            "Delete film will be wired to the API when implemented.",
                                                        )
                                                    }
                                                >
                                                    <TrashBin className="h-4 w-4" aria-hidden />
                                                </button>
                                                <Link
                                                    to={`/admin/films/showtime/${film.maPhim}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-600 bg-rose-600/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-600/20"
                                                >
                                                    <CalendarPlus
                                                        className="h-3.5 w-3.5 shrink-0"
                                                        aria-hidden
                                                    />
                                                    Create showtime
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            rangeStart={rangeStart}
                            rangeEnd={rangeEnd}
                            totalCount={totalCount}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            loading={loading}
                            itemLabel="films"
                            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
                            onNext={() => setPage((p) => p + 1)}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

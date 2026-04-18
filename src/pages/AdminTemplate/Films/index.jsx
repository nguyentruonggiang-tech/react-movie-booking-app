import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { confirmDelete } from "@shared/libs/swal";
import { notifyError, notifySuccess } from "@shared/libs/toast";
import ErrorBox from "../_components/ErrorBox";
import NotFound from "../_components/NotFound";
import Pagination from "../_components/Pagination";
import FilmSearch from "./_components/FilmSearch";
import FilmTable from "./_components/FilmTable";
import { ADMIN_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@constants";
import useDebouncedValue  from "@/hooks/useDebouncedValue";
import { deleteFilm, fetchFilmList } from "./slice";

export default function Films() {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.fetchFilmsReducer);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [deletingMaPhim, setDeletingMaPhim] = useState(null);

    const debouncedSearchRaw = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
    const debouncedTenPhim = useMemo(
        () => debouncedSearchRaw.trim(),
        [debouncedSearchRaw],
    );

    const previousDebouncedTenPhimRef = useRef(undefined);
    useEffect(() => {
        if (previousDebouncedTenPhimRef.current === undefined) {
            previousDebouncedTenPhimRef.current = debouncedTenPhim;
            return;
        }
        if (previousDebouncedTenPhimRef.current !== debouncedTenPhim) {
            previousDebouncedTenPhimRef.current = debouncedTenPhim;
            setPage(1);
        }
    }, [debouncedTenPhim]);

    const fetchListArgs = useMemo(
        () => ({
            page,
            pageSize: ADMIN_PAGE_SIZE,
            ...(debouncedTenPhim !== "" ? { tenPhim: debouncedTenPhim } : {}),
        }),
        [page, debouncedTenPhim],
    );

    useEffect(() => {
        dispatch(fetchFilmList(fetchListArgs));
    }, [dispatch, fetchListArgs]);

    const loadFilmListPage = useCallback(() => {
        dispatch(fetchFilmList(fetchListArgs));
    }, [dispatch, fetchListArgs]);

    const handleDeleteFilm = useCallback(
        async (film) => {
            const maPhim = film?.maPhim;
            if (deletingMaPhim != null || maPhim == null) {
                return;
            }
            const title = film?.tenPhim?.trim() || "this film";
            const isConfirmed = await confirmDelete(title, {
                title: "Delete film?",
                html: `Are you sure you want to delete <strong>"${title}"</strong>? This cannot be undone.`,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
            });
            if (!isConfirmed) {
                return;
            }
            setDeletingMaPhim(maPhim);
            try {
                await dispatch(deleteFilm(maPhim)).unwrap();
                notifySuccess("Film deleted successfully.");
                dispatch(fetchFilmList(fetchListArgs));
            } catch (rejected) {
                const message =
                    typeof rejected === "string" && rejected.trim() !== ""
                        ? rejected
                        : "Could not delete this film. Please try again.";
                notifyError(message);
            } finally {
                setDeletingMaPhim(null);
            }
        },
        [deletingMaPhim, dispatch, fetchListArgs],
    );

    const items = data?.items ?? [];

    const totalCount = data?.totalCount ?? 0;
    const totalPages = Math.max(1, data?.totalPages ?? 1);
    const currentPage = data?.currentPage ?? page;
    const rangeStart =
        totalCount === 0 ? 0 : (currentPage - 1) * ADMIN_PAGE_SIZE + 1;
    const rangeEnd = Math.min(currentPage * ADMIN_PAGE_SIZE, totalCount);

    const handleSearchClear = useCallback(() => {
        setSearchInput("");
    }, []);

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
                    <FilmSearch
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onClear={handleSearchClear}
                    />
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
                        <FilmTable data={[]} loading deletingMaPhim={null} />
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
                        {...(debouncedTenPhim !== ""
                            ? {
                                  actionLabel: "Clear search",
                                  onActionClick: handleSearchClear,
                              }
                            : {})}
                    />
                ) : null}

                {!error && !loading && items.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-zinc-800">
                        <FilmTable
                            data={items}
                            loading={false}
                            deletingMaPhim={deletingMaPhim}
                            onDelete={handleDeleteFilm}
                        />
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

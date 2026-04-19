import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { confirmDelete } from "@shared/lib/swal";
import { notifyError, notifySuccess } from "@shared/lib/toast";
import ErrorBox from "../_components/ErrorBox";
import NotFound from "../_components/NotFound";
import Pagination from "../_components/Pagination";
import FilmSearch from "./_components/FilmSearch";
import FilmTable from "./_components/FilmTable";
import { ADMIN_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@constants";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { deleteFilm, fetchList, filmsSelectors } from "./slice";

export default function Films() {
    const dispatch = useDispatch();
    const items = useSelector(filmsSelectors.list);
    const loading = useSelector(filmsSelectors.loading);
    const error = useSelector(filmsSelectors.error);
    const pagination = useSelector(filmsSelectors.pagination);
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
        dispatch(fetchList(fetchListArgs));
    }, [dispatch, fetchListArgs]);

    const loadFilmListPage = useCallback(() => {
        dispatch(fetchList(fetchListArgs));
    }, [dispatch, fetchListArgs]);

    const handleDeleteFilm = useCallback(
        async (film) => {
            const maPhim = film?.maPhim;
            if (deletingMaPhim != null || maPhim == null) {
                return;
            }
            const title = film?.tenPhim?.trim() || "phim này";
            const isConfirmed = await confirmDelete(title, {
                title: "Xóa phim?",
                html: `Bạn có chắc muốn xóa <strong>"${title}"</strong>? Thao tác này không thể hoàn tác.`,
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy",
            });
            if (!isConfirmed) {
                return;
            }
            setDeletingMaPhim(maPhim);
            try {
                await dispatch(deleteFilm(maPhim)).unwrap();
                notifySuccess("Đã xóa phim thành công.");
                dispatch(fetchList(fetchListArgs));
            } catch (rejected) {
                const message =
                    typeof rejected === "string" && rejected.trim() !== ""
                        ? rejected
                        : "Không thể xóa phim. Vui lòng thử lại.";
                notifyError(message);
            } finally {
                setDeletingMaPhim(null);
            }
        },
        [deletingMaPhim, dispatch, fetchListArgs],
    );

    const totalCount = pagination?.totalCount ?? 0;
    const totalPages = Math.max(1, pagination?.totalPages ?? 1);
    const currentPage = pagination?.currentPage ?? page;
    const pageSize = pagination?.pageSize ?? ADMIN_PAGE_SIZE;
    const rangeStart =
        totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const rangeEnd = Math.min(currentPage * pageSize, totalCount);

    const handleSearchClear = useCallback(() => {
        setSearchInput("");
    }, []);

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Danh sách phim</h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Quản lý thư viện phim và lịch chiếu hệ thống
                    </p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:max-w-md sm:flex-1 sm:justify-end">
                    <Link
                        to="/admin/films/addnew"
                        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-900/30 transition hover:bg-rose-500"
                    >
                        Thêm phim
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
                        title="Không thể tải danh sách phim"
                        message={error}
                        onRetry={loadFilmListPage}
                    />
                ) : null}

                {!error && loading ? (
                    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <FilmTable data={[]} loading deletingMaPhim={null} />
                    </div>
                ) : null}

                {!error && !loading && items.length === 0 ? (
                    <NotFound
                        title={debouncedTenPhim !== "" ? "Không có phim phù hợp" : "Chưa có phim"}
                        message={
                            debouncedTenPhim !== ""
                                ? "Không có phim khớp tìm kiếm."
                                : "Trang này chưa có phim."
                        }
                        {...(debouncedTenPhim !== ""
                            ? {
                                  actionLabel: "Xóa bộ lọc",
                                  onActionClick: handleSearchClear,
                              }
                            : {})}
                    />
                ) : null}

                {!error && !loading && items.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
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

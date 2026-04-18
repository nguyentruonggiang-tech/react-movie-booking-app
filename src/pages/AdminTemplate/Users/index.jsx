import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UserAdd } from "flowbite-react-icons/outline";
import ErrorBox from "../_components/ErrorBox";
import NotFound from "../_components/NotFound";
import Pagination from "../_components/Pagination";
import UserSearch from "./_components/UserSearch";
import UserTable from "./_components/UserTable";
import { ADMIN_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@constants";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { fetchUserList, fetchUserRoleTypes, usersSelectors } from "./slice";

function UsersListBody({ debouncedTuKhoa, onClearSearch }) {
    const dispatch = useDispatch();
    const items = useSelector(usersSelectors.list);
    const loading = useSelector(usersSelectors.loading);
    const error = useSelector(usersSelectors.error);
    const pagination = useSelector(usersSelectors.pagination);
    const roleTypeOptions = useSelector(usersSelectors.roleTypes);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchUserRoleTypes());
    }, [dispatch]);

    const fetchListArgs = useMemo(
        () => ({
            page,
            pageSize: ADMIN_PAGE_SIZE,
            ...(debouncedTuKhoa !== "" ? { tuKhoa: debouncedTuKhoa } : {}),
        }),
        [page, debouncedTuKhoa],
    );

    useEffect(() => {
        dispatch(fetchUserList(fetchListArgs));
    }, [dispatch, fetchListArgs]);

    const loadUserList = useCallback(() => {
        dispatch(fetchUserList(fetchListArgs));
    }, [dispatch, fetchListArgs]);

    const totalCount = pagination?.totalCount ?? 0;
    const currentPage = pagination?.currentPage ?? page;
    const pageSize = pagination?.pageSize ?? ADMIN_PAGE_SIZE;
    // Backend may overcount, 
    // so always recalculate totalPages from totalCount and pageSize
    const totalPages = Math.max(
        1,
        Math.ceil((totalCount ?? 0) / pageSize)
    );
    const rangeStart =
        totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const rangeEnd = Math.min(currentPage * pageSize, totalCount);

    return (
        <div className="mt-8">
            {error ? (
                <ErrorBox
                    title="Could not load user list"
                    message={error}
                    onRetry={loadUserList}
                />
            ) : null}

            {!error && loading ? (
                <div className="overflow-hidden rounded-xl border border-zinc-800">
                    <UserTable
                        data={[]}
                        loading
                        roleTypeOptions={roleTypeOptions}
                    />
                </div>
            ) : null}

            {!error && !loading && items.length === 0 ? (
                <NotFound
                    title={
                        debouncedTuKhoa !== ""
                            ? "No matching users"
                            : "No users"
                    }
                    message={
                        debouncedTuKhoa !== ""
                            ? "No users match your search."
                            : "No users on this page."
                    }
                    {...(debouncedTuKhoa !== ""
                        ? {
                              actionLabel: "Clear search",
                              onActionClick: onClearSearch,
                          }
                        : {})}
                />
            ) : null}

            {!error && !loading && items.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-zinc-800">
                    <UserTable
                        data={items}
                        loading={false}
                        serialStart={rangeStart}
                        roleTypeOptions={roleTypeOptions}
                    />
                    <Pagination
                        rangeStart={rangeStart}
                        rangeEnd={rangeEnd}
                        totalCount={totalCount}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        loading={loading}
                        itemLabel="users"
                        onPrevious={() => setPage((p) => Math.max(1, p - 1))}
                        onNext={() => setPage((p) => p + 1)}
                    />
                </div>
            ) : null}
        </div>
    );
}

export default function Users() {
    const [searchInput, setSearchInput] = useState("");

    const debouncedSearchRaw = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
    const debouncedTuKhoa = useMemo(
        () => debouncedSearchRaw.trim(),
        [debouncedSearchRaw],
    );

    const handleSearchClear = useCallback(() => {
        setSearchInput("");
    }, []);

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">User management</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        System account list
                    </p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:max-w-xl sm:flex-1 sm:justify-end">
                    <Link
                        to="/admin/users/add"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-900/30 transition hover:bg-rose-500"
                    >
                        <UserAdd className="h-4 w-4 shrink-0" aria-hidden />
                        Add user
                    </Link>
                    <UserSearch
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onClear={handleSearchClear}
                    />
                </div>
            </div>

            <UsersListBody
                key={debouncedTuKhoa}
                debouncedTuKhoa={debouncedTuKhoa}
                onClearSearch={handleSearchClear}
            />
        </div>
    );
}

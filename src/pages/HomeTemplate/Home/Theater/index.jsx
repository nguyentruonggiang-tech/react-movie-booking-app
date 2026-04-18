import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchTheaterSystems,
    fetchTheaterClusters,
    fetchTheaterShowtimes,
} from "./slice";
import ErrorBox from "@pages/HomeTemplate/_components/ErrorBox";
import TheaterSystemList from "./_components/TheaterSystemList";
import TheaterClusterList from "./_components/TheaterClusterList";
import ShowtimeList from "./_components/ShowtimeList";
import ColumnSkeleton from "./_components/ColumnSkeleton";
import ColumnEmpty from "./_components/ColumnEmpty";

const emptyTheaterColumn =
    "flex h-[640px] max-h-[640px] flex-col items-center justify-center rounded-xl border border-white/10 bg-zinc-900/60 p-4 text-center";

export default function Theater() {
    const dispatch = useDispatch();

    const theaterSystemsState = useSelector(
        (state) => state.theaterSystemsReducer,
    );
    const theaterClustersState = useSelector(
        (state) => state.theaterClustersReducer,
    );
    const theaterShowtimesState = useSelector(
        (state) => state.theaterShowtimesReducer,
    );

    const [selectedSystemCode, setSelectedSystemCode] = useState(null);
    const [selectedClusterCode, setSelectedClusterCode] = useState(null);

    const theaterSystems = Array.isArray(theaterSystemsState?.data)
        ? theaterSystemsState.data
        : [];

    const theaterClusters = Array.isArray(theaterClustersState?.data)
        ? theaterClustersState.data
        : [];

    const movies = Array.isArray(theaterShowtimesState?.data)
        ? theaterShowtimesState.data
        : [];

    const currentSystemCode =
        selectedSystemCode ?? theaterSystems[0]?.maHeThongRap ?? null;

    const currentClusterCode =
        selectedClusterCode ?? theaterClusters[0]?.maCumRap ?? null;

    const activeCluster = theaterClusters.find(
        (c) => c?.maCumRap === currentClusterCode,
    );
    const activeClusterName = activeCluster?.tenCumRap ?? "";
    const activeClusterAddress = activeCluster?.diaChi ?? "";

    const handleSelectSystem = (code) => {
        setSelectedSystemCode(code);
        setSelectedClusterCode(null);
    };

    useEffect(() => {
        dispatch(fetchTheaterSystems());
    }, [dispatch]);

    useEffect(() => {
        if (!currentSystemCode) return;
        dispatch(fetchTheaterClusters(currentSystemCode));
    }, [dispatch, currentSystemCode]);

    useEffect(() => {
        if (!currentSystemCode || !currentClusterCode) return;
        dispatch(
            fetchTheaterShowtimes({
                theaterSystemCode: currentSystemCode,
                clusterCode: currentClusterCode,
            }),
        );
    }, [dispatch, currentSystemCode, currentClusterCode]);

    return (
        <section
            id="theater-system"
            className="mx-auto w-full min-w-0 max-w-7xl overflow-x-hidden px-8 py-6 md:py-8"
            aria-labelledby="theater-heading"
        >
            <h2
                id="theater-heading"
                className="mb-8 text-4xl font-black uppercase tracking-tight text-white"
            >
                Hệ thống rạp
            </h2>

            <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[96px_320px_minmax(0,1fr)] lg:items-stretch">
                <div className="min-w-0">
                    {theaterSystemsState?.loading ? (
                        <ColumnSkeleton
                            count={6}
                            itemClassName="h-14"
                            wrapperClassName="p-3"
                        />
                    ) : theaterSystemsState?.error ? (
                        <ErrorBox
                            title="Hệ thống rạp"
                            message={theaterSystemsState.error}
                            onRetry={() => dispatch(fetchTheaterSystems())}
                        />
                    ) : theaterSystems.length === 0 ? (
                        <ColumnEmpty
                            className={emptyTheaterColumn}
                            title="Chưa có hệ thống rạp"
                            description="API hiện không trả về chuỗi rạp. Vui lòng thử lại sau."
                        />
                    ) : (
                        <TheaterSystemList
                            theaterSystems={theaterSystems}
                            selectedSystemCode={currentSystemCode}
                            onSelectSystem={handleSelectSystem}
                        />
                    )}
                </div>

                <div className="min-w-0">
                    {theaterSystemsState?.loading ||
                    theaterClustersState?.loading ? (
                        <ColumnSkeleton
                            count={5}
                            itemClassName="h-20"
                            wrapperClassName="p-4"
                        />
                    ) : theaterClustersState?.error ? (
                        <ErrorBox
                            title="Cụm rạp"
                            message={theaterClustersState.error}
                            onRetry={() =>
                                dispatch(
                                    fetchTheaterClusters(currentSystemCode),
                                )
                            }
                        />
                    ) : !currentSystemCode ? (
                        <ColumnEmpty
                            className={emptyTheaterColumn}
                            title="Chọn chuỗi rạp"
                            description="Hãy chọn một chuỗi rạp ở cột đầu tiên."
                        />
                    ) : theaterClusters.length === 0 ? (
                        <ColumnEmpty
                            className={emptyTheaterColumn}
                            title="Chưa có cụm rạp"
                            description="Chuỗi rạp này chưa có cụm rạp trong dữ liệu trả về."
                        />
                    ) : (
                        <TheaterClusterList
                            theaterClusters={theaterClusters}
                            selectedClusterCode={currentClusterCode}
                            onSelectCluster={setSelectedClusterCode}
                        />
                    )}
                </div>

                <div className="min-h-0 min-w-0 w-full max-w-full overflow-x-hidden">
                    {(theaterClustersState?.loading && currentSystemCode) ||
                    theaterShowtimesState?.loading ? (
                        <ColumnSkeleton
                            count={4}
                            itemClassName="h-24"
                            wrapperClassName="p-4"
                        />
                    ) : theaterShowtimesState?.error ? (
                        <ErrorBox
                            title="Lịch chiếu"
                            message={theaterShowtimesState.error}
                            onRetry={() =>
                                dispatch(
                                    fetchTheaterShowtimes({
                                        theaterSystemCode: currentSystemCode,
                                        clusterCode: currentClusterCode,
                                    }),
                                )
                            }
                        />
                    ) : !currentSystemCode || !currentClusterCode ? (
                        <ColumnEmpty
                            className={emptyTheaterColumn}
                            title="Lịch chiếu"
                            description="Chọn chuỗi rạp và cụm rạp để tải lịch chiếu."
                        />
                    ) : (
                        <ShowtimeList
                            movies={movies}
                            clusterName={activeClusterName}
                            clusterAddress={activeClusterAddress}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}

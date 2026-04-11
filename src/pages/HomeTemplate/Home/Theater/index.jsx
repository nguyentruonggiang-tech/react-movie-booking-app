import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchTheaterSystems,
    fetchTheaterClusters,
    fetchTheaterShowtimes,
} from "./slice";
import TheaterSystemList from "./_components/TheaterSystemList";
import TheaterClusterList from "./_components/TheaterClusterList";
import ShowtimeList from "./_components/ShowtimeList";
import ErrorBox from "./_components/ErrorBox";
import ColumnSkeleton from "./_components/ColumnSkeleton";
import ColumnEmpty from "./_components/ColumnEmpty";

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
            className="mx-auto max-w-7xl px-8 pb-24"
            aria-labelledby="theater-heading"
        >
            <h2
                id="theater-heading"
                className="mb-8 text-4xl font-black uppercase tracking-tight text-white"
            >
                Theater systems
            </h2>

            <div className="grid gap-4 lg:grid-cols-[96px_320px_1fr]">
                {theaterSystemsState?.loading ? (
                    <ColumnSkeleton
                        count={6}
                        itemClassName="h-14"
                        wrapperClassName="p-3"
                    />
                ) : theaterSystemsState?.error ? (
                    <ErrorBox
                        message={theaterSystemsState.error}
                        onRetry={() => dispatch(fetchTheaterSystems())}
                    />
                ) : theaterSystems.length === 0 ? (
                    <ColumnEmpty
                        title="No theater systems"
                        description="The API returned no theater chains. Try again later."
                    />
                ) : (
                    <TheaterSystemList
                        theaterSystems={theaterSystems}
                        selectedSystemCode={currentSystemCode}
                        onSelectSystem={handleSelectSystem}
                    />
                )}

                {theaterSystemsState?.loading ||
                theaterClustersState?.loading ? (
                    <ColumnSkeleton
                        count={5}
                        itemClassName="h-20"
                        wrapperClassName="p-4"
                    />
                ) : theaterClustersState?.error ? (
                    <ErrorBox
                        message={theaterClustersState.error}
                        onRetry={() =>
                            dispatch(
                                fetchTheaterClusters(currentSystemCode),
                            )
                        }
                    />
                ) : !currentSystemCode ? (
                    <ColumnEmpty
                        title="Select a chain"
                        description="Pick a theater chain in the first column."
                    />
                ) : theaterClusters.length === 0 ? (
                    <ColumnEmpty
                        title="No clusters"
                        description="This chain has no clusters in the API response."
                    />
                ) : (
                    <TheaterClusterList
                        theaterClusters={theaterClusters}
                        selectedClusterCode={currentClusterCode}
                        onSelectCluster={setSelectedClusterCode}
                    />
                )}

                {(theaterClustersState?.loading && currentSystemCode) ||
                theaterShowtimesState?.loading ? (
                    <ColumnSkeleton
                        count={4}
                        itemClassName="h-24"
                        wrapperClassName="p-4"
                    />
                ) : theaterShowtimesState?.error ? (
                    <ErrorBox
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
                        title="Showtimes"
                        description="Pick a chain and a cluster to load showtimes."
                    />
                ) : (
                    <ShowtimeList
                        movies={movies}
                        clusterName={activeClusterName}
                        clusterAddress={activeClusterAddress}
                    />
                )}
            </div>
        </section>
    );
}

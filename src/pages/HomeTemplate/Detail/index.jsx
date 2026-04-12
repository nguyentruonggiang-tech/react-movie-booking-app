import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearMovieDetail, fetchMovieDetail } from "./slice";

import DetailBackdrop from "./_components/Backdrop";
import Loading from "./_components/Loading";
import ErrorBox from "./_components/ErrorBox";
import NotFound from "./_components/NotFound";
import MovieInfo from "./_components/MovieInfo";

export default function Detail() {
    const { maPhim } = useParams();
    const dispatch = useDispatch();

    const { data, loading, error } = useSelector(
        (state) => state.movieDetailReducer,
    );

    useEffect(() => {
        if (!maPhim) return;

        dispatch(fetchMovieDetail(maPhim));

        return () => {
            dispatch(clearMovieDetail());
        };
    }, [maPhim, dispatch]);

    if (loading) return <Loading />;

    if (error) {
        return (
            <ErrorBox
                message={error}
                onRetry={() => dispatch(fetchMovieDetail(maPhim))}
            />
        );
    }

    if (!data) return <NotFound />;

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0c0e12]">
            <DetailBackdrop posterUrl={data.hinhAnh} />
            <MovieInfo data={data} />
        </div>
    );
}
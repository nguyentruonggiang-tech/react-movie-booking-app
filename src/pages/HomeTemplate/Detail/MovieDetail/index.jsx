import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearMovieDetail, fetchMovieDetail } from "./slice";

import Backdrop from "./_components/Backdrop";
import MovieDetailSkeleton from "./_components/MovieDetailSkeleton";
import ErrorBox from "@pages/HomeTemplate/_components/ErrorBox";
import NotFound from "@pages/HomeTemplate/_components/NotFound";
import MovieInfo from "./_components/MovieInfo";

export default function MovieDetail() {
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

    if (loading) return <MovieDetailSkeleton />;

    if (error) {
        return ( 
            <ErrorBox
                title="Movie Detail Error"
                message={error}
                onRetry={() => dispatch(fetchMovieDetail(maPhim))}
            />
        );
    }

    if (!data) {
        return (
            <div className="w-full max-w-xl mx-auto">
                <NotFound
                    title="Movie not found"
                    message="No movie data was returned for this id."
                />
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-[#0c0e12]">
            <Backdrop posterUrl={data.hinhAnh} />
            <MovieInfo data={data} />
        </div>
    );
}

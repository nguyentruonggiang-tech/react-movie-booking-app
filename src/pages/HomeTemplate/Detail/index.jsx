import MovieDetail from "./MovieDetail";
import ShowtimeSection from "./ShowtimeSection";

export default function Detail() {
    return (
        <div className="relative bg-slate-100 dark:bg-[#0c0e12]">
            <MovieDetail />
            <ShowtimeSection/>
        </div>
    );
}
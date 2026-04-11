import BannerCarousel from "./_components/BannerCarousel";
import MovieList from "./_components/MovieList";
import Theater from "./Theater";

export default function Home() {
    return (
        <div className="w-full">
            <BannerCarousel />
            <MovieList />
            <Theater />
        </div>
    );
}

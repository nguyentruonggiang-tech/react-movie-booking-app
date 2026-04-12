import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "flowbite-react";
import { WRAPPER_CLASS } from "./constants";
import { fetchBannerList } from "./slice";
import ErrorBox from "@pages/HomeTemplate/_components/ErrorBox";
import BannerSlide from "./_components/BannerSlide";
import BannerOverlay from "./_components/BannerOverlay";
import BannerLoading from "./_components/BannerLoading";
import BannerEmpty from "./_components/BannerEmpty";

const carouselTheme = {
    root: {
        base: "relative h-full min-h-0 w-full overflow-hidden",
        leftControl:
            "absolute left-0 top-0 z-30 flex h-full items-center justify-center px-4 focus:outline-none",
        rightControl:
            "absolute right-0 top-0 z-30 flex h-full items-center justify-center px-4 focus:outline-none",
    },
    scrollContainer: {
        base: "flex h-full min-h-0 snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth",
        snap: "snap-x",
    },
    item: {
        base: "relative block h-full min-h-0 w-full",
        wrapper: {
            on: "h-full min-h-0 w-full shrink-0 snap-center transform cursor-grab",
            off: "h-full min-h-0 w-full shrink-0 snap-center transform cursor-default",
        },
    },
    indicators: {
        active: {
            off: "bg-white/20 hover:bg-white/35",
            on: "bg-red-600",
        },
        base: "h-1 w-12 shrink-0 rounded-full transition-all",
        wrapper:
            "absolute bottom-5 left-1/2 z-30 flex max-w-[calc(100%-2rem)] -translate-x-1/2 flex-wrap justify-center gap-3",
    },
    control: {
        base: "inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70",
        icon: "h-4 w-4 text-white",
    },
};

function NavArrowGlyph({ direction }) {
    const isPrev = direction === "prev";
    return (
        <span className={carouselTheme.control.base}>
            <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 6 10"
                aria-hidden
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isPrev ? "M5 1 1 5l4 4" : "m1 9 4-4-4-4"}
                />
            </svg>
        </span>
    );
}

export default function BannerCarousel() {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.bannerReducer);

    const banners = useMemo(() => {
        return Array.isArray(data) ? data : [];
    }, [data]);

    const refetch = useCallback(() => {
        dispatch(fetchBannerList());
    }, [dispatch]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const [activeIndex, setActiveIndex] = useState(0);

    const safeIndex = Math.min(activeIndex, banners.length - 1);
    const movieId = banners[safeIndex]?.maPhim ?? null;

    if (loading) {
        return <BannerLoading />;
    }

    if (error) {
        return (
            <div className={WRAPPER_CLASS}>
                <div className="flex h-full w-full items-center justify-center">
                    <ErrorBox
                        title="Banner"
                        message={error}
                        onRetry={refetch}
                    />
                </div>
            </div>
        );
    }

    if (banners.length === 0) {
        return <BannerEmpty />;
    }

    return (
        <div className="relative w-full">
            <div className={WRAPPER_CLASS}>
                <Carousel
                    theme={carouselTheme}
                    slide
                    slideInterval={3000}
                    draggable
                    indicators
                    onSlideChange={setActiveIndex}
                    leftControl={<NavArrowGlyph direction="prev" />}
                    rightControl={<NavArrowGlyph direction="next" />}
                    className="h-full min-h-0"
                >
                    {banners.map((item, index) => (
                        <BannerSlide
                            key={`banner-${item?.maBanner ?? index}`}
                            item={item}
                            index={index}
                        />
                    ))}
                </Carousel>

                <BannerOverlay movieId={movieId} />
            </div>
        </div>
    );
}

import { memo } from "react";
import BannerButtons from "./BannerButtons";

function BannerOverlay({ movieId }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      <div className="relative z-40 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-end px-4 pb-10 sm:px-8 sm:pb-12 md:pb-14">
        <div className="pointer-events-auto">
          <BannerButtons movieId={movieId} />
        </div>
      </div>
    </div>
  );
}

export default memo(BannerOverlay);
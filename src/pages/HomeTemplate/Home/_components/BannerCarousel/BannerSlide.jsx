import { memo } from "react";

function BannerSlide({ item, index }) {
  const src = item?.hinhAnh || "";
  const alt = `Banner ${index + 1}`;

  return (
    <div className="relative z-0 flex h-full min-h-0 min-w-0 flex-[0_0_100%]">
      {src ? (
        <>
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 block h-full w-full scale-110 object-cover blur-sm opacity-62 brightness-125 saturate-115"
          />

          <div className="absolute inset-0 m-auto h-full w-[90%] md:w-[84%]">
            <img
              src={src}
              alt={alt}
              className="block h-full w-full object-contain opacity-100 brightness-105 saturate-110 drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
            />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-slate-900" />
      )}
    </div>
  );
}

export default memo(BannerSlide);
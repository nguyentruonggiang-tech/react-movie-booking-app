import { useState } from "react";

export default function Backdrop({ posterUrl }) {
    const [isImageError, setIsImageError] = useState(false);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
            aria-hidden="true"
        >
            {!isImageError && posterUrl ? (
                <>
                    <img
                        src={posterUrl}
                        alt=""
                        className="h-full w-full scale-110 object-cover opacity-35 blur-[18px] dark:opacity-60"
                        onError={() => setIsImageError(true)}
                    />
                    <div className="absolute inset-0 bg-white/82 dark:bg-[#0c0e12]/64" />
                </>
            ) : (
                <div className="h-full w-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-zinc-950 dark:via-[#0c0e12] dark:to-black" />
            )}
        </div>
    );
}

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
                        className="h-full w-full scale-110 object-cover opacity-60 blur-[18px]"
                        onError={() => setIsImageError(true)}
                    />
                    <div className="absolute inset-0 bg-[#0c0e12]/64" />
                </>
            ) : (
                <div className="h-full w-full bg-gradient-to-br from-zinc-950 via-[#0c0e12] to-black" />
            )}
        </div>
    );
}
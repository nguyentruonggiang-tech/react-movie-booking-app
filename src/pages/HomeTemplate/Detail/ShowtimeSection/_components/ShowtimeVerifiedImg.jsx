import { useEffect, useState } from "react";

import { SHOWTIME_NO_IMAGE_URL } from "../constants";
import { checkImageUrlExists, imgSrc, onImgError } from "../utils";

/**
 * Theater / cluster image: try primary URL, then optional fallback (chain logo), else placeholder.
 */
export default function ShowtimeVerifiedImg({
    rawUrl,
    fallbackRawUrl,
    ...imgProps
}) {
    const [src, setSrc] = useState(SHOWTIME_NO_IMAGE_URL);

    useEffect(() => {
        let alive = true;
        const primary = imgSrc(rawUrl);
        const fallback = imgSrc(fallbackRawUrl ?? "");

        queueMicrotask(() => {
            if (alive) setSrc(SHOWTIME_NO_IMAGE_URL);
        });

        (async () => {
            if (primary && (await checkImageUrlExists(primary))) {
                if (alive) setSrc(primary);
                return;
            }
            if (fallback && (await checkImageUrlExists(fallback))) {
                if (alive) setSrc(fallback);
                return;
            }
            if (alive) setSrc(SHOWTIME_NO_IMAGE_URL);
        })();

        return () => {
            alive = false;
        };
    }, [rawUrl, fallbackRawUrl]);

    return <img src={src} {...imgProps} onError={onImgError} />;
}

import { memo } from "react";
import { NavLink } from "react-router-dom";
import { BTN_PRIMARY, BTN_SECONDARY } from "../constants";
import { InfoIcon, PlayIcon } from "@pages/HomeTemplate/_components/icons";

function BannerButtons({ movieId }) {
    if (!movieId) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-4">
            <NavLink to={`/detail/${movieId}`} className={BTN_PRIMARY}>
                <PlayIcon className="h-6 w-6 shrink-0" />
                Book now
            </NavLink>

            <NavLink to={`/detail/${movieId}`} className={BTN_SECONDARY}>
                <InfoIcon className="h-6 w-6 shrink-0" />
                View details
            </NavLink>
        </div>
    );
}

export default memo(BannerButtons);

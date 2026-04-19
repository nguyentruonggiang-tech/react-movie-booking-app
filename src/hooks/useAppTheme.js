import { useSyncExternalStore } from "react";
import { useSelector } from "react-redux";
import {
    osDarkServer,
    osDarkSnap,
    modeFrom,
    subOsDark,
} from "@utils/theme";

export function useAppTheme() {
    const pref = useSelector((state) => state.theme.pref);
    const os = useSyncExternalStore(subOsDark, osDarkSnap, osDarkServer);
    return modeFrom(pref, os);
}

import { useLayoutEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { htmlDark } from "@utils/theme";

export default function ThemeSync() {
    const mode = useAppTheme();

    useLayoutEffect(() => {
        htmlDark(mode);
    }, [mode]);

    return null;
}

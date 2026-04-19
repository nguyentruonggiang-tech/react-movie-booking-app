import ThemeToggle from "@components/ThemeToggle";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function AuthThemeCorner() {
    const mode = useAppTheme();
    return (
        <div className="pointer-events-auto fixed end-4 top-4 z-[60]">
            <ThemeToggle variant={mode === "dark" ? "onDarkPanel" : "default"} />
        </div>
    );
}

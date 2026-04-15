import "sweetalert2/dist/sweetalert2.min.css";
import "./styles.css";

export const SWAL_BASE_OPTIONS = {
    heightAuto: false,
    buttonsStyling: false,
};

function resolveSwalTheme(themeMode = "auto") {
    if (themeMode === "dark" || themeMode === "light") {
        return themeMode;
    }

    if (typeof document !== "undefined") {
        const rootClassList = document.documentElement.classList;
        if (rootClassList.contains("dark")) {
            return "dark";
        }
        if (rootClassList.contains("light")) {
            return "light";
        }
        // Tailwind "class" dark mode: no `.dark` on <html> => treat as light (do not use OS — was overriding user intent)
        return "light";
    }

    return "light";
}

function buildThemeOptions(resolvedTheme) {
    const isDarkTheme = resolvedTheme === "dark";

    return {
        /* Background: see `styles.css` (.swal-theme-*) — avoid inline background overriding CSS */
        color: isDarkTheme ? "#e5e7eb" : "#111827",
        customClass: {
            popup: `swal-popup ${isDarkTheme ? "swal-theme-dark" : "swal-theme-light"}`,
            title: "swal-title",
            htmlContainer: "swal-content",
            confirmButton: "swal-confirm-btn",
            cancelButton: "swal-cancel-btn",
        },
    };
}

function mergeCustomClass(themeClass = {}, customClass = {}) {
    const merged = { ...themeClass };
    const keys = new Set([
        ...Object.keys(themeClass || {}),
        ...Object.keys(customClass || {}),
    ]);

    keys.forEach((key) => {
        const themeValue = themeClass?.[key];
        const customValue = customClass?.[key];

        if (typeof themeValue === "string" && typeof customValue === "string") {
            merged[key] = `${themeValue} ${customValue}`.trim();
            return;
        }

        if (customValue !== undefined) {
            merged[key] = customValue;
            return;
        }

        merged[key] = themeValue;
    });

    return merged;
}

export function buildSwalOptions(customOptions = {}) {
    const { themeMode = "auto", customClass, ...restOptions } = customOptions;
    const resolvedTheme = resolveSwalTheme(themeMode);
    const themeOptions = buildThemeOptions(resolvedTheme);

    return {
        ...SWAL_BASE_OPTIONS,
        ...themeOptions,
        ...restOptions,
        customClass: mergeCustomClass(themeOptions.customClass, customClass),
    };
}

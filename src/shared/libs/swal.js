import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./swal.css";

const SWAL_BASE_OPTIONS = {
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
        return "light";
    }

    return "light";
}

function buildThemeOptions(resolvedTheme) {
    const isDarkTheme = resolvedTheme === "dark";

    return {
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

function buildSwalOptions(customOptions = {}) {
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

export async function showSwalConfirm({
    title = "Confirm?",
    text = "Are you sure you want to perform this action?",
    html,
    icon = "warning",
    themeMode = "auto",
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
}) {
    // SweetAlert2: use either `html` or `text`, not both for the main body.
    const body =
        html !== undefined
            ? { html }
            : { text };

    const result = await Swal.fire(
        buildSwalOptions({
            title,
            ...body,
            icon,
            themeMode,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            reverseButtons: true,
            customClass: {
                popup: "swal-confirm-popup",
                title: "swal-confirm-title",
                htmlContainer: "swal-confirm-text",
                confirmButton: "swal-confirm-main-btn",
                cancelButton: "swal-confirm-cancel-btn",
            },
        }),
    );

    return result.isConfirmed === true;
}

export async function showSwalSuccess({
    title = "Success",
    text,
    confirmButtonText = "OK",
    timer,
}) {
    const result = await Swal.fire(
        buildSwalOptions({
            title,
            text,
            icon: "success",
            confirmButtonText,
            ...(timer ? { timer } : {}),
        }),
    );

    return result.isConfirmed === true;
}

export async function showSwalError({
    title = "Something went wrong",
    text,
    confirmButtonText = "OK",
}) {
    const result = await Swal.fire(
        buildSwalOptions({
            title,
            text,
            icon: "error",
            confirmButtonText,
        }),
    );

    return result.isConfirmed === true;
}

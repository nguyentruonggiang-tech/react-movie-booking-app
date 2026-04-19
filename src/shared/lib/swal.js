import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "@/shared/styles/swal.css";

const BASE_OPTIONS = {
    heightAuto: false,
    buttonsStyling: false,
};

function resolveTheme(themeMode = "auto") {
    if (themeMode === "dark" || themeMode === "light") {
        return themeMode;
    }

    if (typeof document !== "undefined") {
        const rootClassList = document.documentElement.classList;

        if (rootClassList.contains("dark")) return "dark";
        if (rootClassList.contains("light")) return "light";
    }
    return "light";
}

function mergeCustomClass(baseClass = {}, customClass = {}) {
    const merged = { ...baseClass };
    const keys = new Set([
        ...Object.keys(baseClass || {}),
        ...Object.keys(customClass || {}),
    ]);

    keys.forEach((key) => {
        const baseValue = baseClass?.[key];
        const customValue = customClass?.[key];

        if (typeof baseValue === "string" && typeof customValue === "string") {
            merged[key] = `${baseValue} ${customValue}`.trim();
            return;
        }

        if (customValue !== undefined) {
            merged[key] = customValue;
            return;
        }

        merged[key] = baseValue;
    });

    return merged;
}

function buildThemeOptions(themeMode = "auto") {
    const resolvedTheme = resolveTheme(themeMode);
    const isDarkTheme = resolvedTheme === "dark";

    return {
        color: isDarkTheme ? "#e5e7eb" : "#111827",
        customClass: {
            popup: `my-swal-popup ${isDarkTheme ? "my-swal-theme-dark" : "my-swal-theme-light"
                }`,
            title: "my-swal-title",
            htmlContainer: "my-swal-content",
            confirmButton: "my-swal-confirm-btn",
            cancelButton: "my-swal-cancel-btn",
        },
    };
}

function buildOptions(options = {}) {
    const { themeMode = "auto", customClass, ...restOptions } = options;
    const themeOptions = buildThemeOptions(themeMode);

    return {
        ...BASE_OPTIONS,
        ...themeOptions,
        ...restOptions,
        customClass: mergeCustomClass(themeOptions.customClass, customClass),
    };
}

export async function confirm({
    title = "Confirm?",
    text = "Are you sure you want to perform this action?",
    html,
    icon = "warning",
    themeMode = "auto",
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
} = {}) {
    const body = html !== undefined ? { html } : { text };

    const result = await Swal.fire(
        buildOptions({
            title,
            ...body,
            icon,
            themeMode,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            reverseButtons: true,
            focusCancel: true,
            customClass: {
                popup: "my-swal-confirm-popup",
                title: "my-swal-confirm-title",
                htmlContainer: "my-swal-confirm-text",
                confirmButton: "my-swal-confirm-main-btn",
                cancelButton: "my-swal-confirm-cancel-btn",
            },
        })
    );

    return result.isConfirmed === true;
}

export async function alertSuccess({
    title = "Success",
    text = "",
    html,
    confirmButtonText = "OK",
    timer,
    themeMode = "auto",
} = {}) {
    const body = html !== undefined ? { html } : { text };

    const result = await Swal.fire(
        buildOptions({
            title,
            ...body,
            icon: "success",
            confirmButtonText,
            themeMode,
            ...(timer ? { timer } : {}),
        })
    );

    return result.isConfirmed === true;
}

export async function alertError({
    title = "Something went wrong",
    text = "",
    html,
    confirmButtonText = "OK",
    themeMode = "auto",
} = {}) {
    const body = html !== undefined ? { html } : { text };

    const result = await Swal.fire(
        buildOptions({
            title,
            ...body,
            icon: "error",
            confirmButtonText,
            themeMode,
        })
    );

    return result.isConfirmed === true;
}

export async function alertInfo({
    title = "Information",
    text = "",
    html,
    confirmButtonText = "OK",
    themeMode = "auto",
} = {}) {
    const body = html !== undefined ? { html } : { text };

    const result = await Swal.fire(
        buildOptions({
            title,
            ...body,
            icon: "info",
            confirmButtonText,
            themeMode,
        })
    );

    return result.isConfirmed === true;
}

export function openLoading({
    title = "Processing...",
    text = "Please wait a moment.",
    themeMode = "auto",
    allowOutsideClick = false,
    allowEscapeKey = false,
} = {}) {
    Swal.fire(
        buildOptions({
            title,
            text,
            themeMode,
            allowOutsideClick,
            allowEscapeKey,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        })
    );
}

export function closeDialog() {
    Swal.close();
}

export function confirmDelete(name = "item", options = {}) {
    return confirm({
        title: `Delete ${name}?`,
        text: "This action cannot be undone.",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        ...options,
    });
}
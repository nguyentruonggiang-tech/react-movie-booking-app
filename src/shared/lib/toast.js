import { toast } from "react-toastify";

function toastTheme() {
    if (typeof document === "undefined") {
        return "light";
    }
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function buildToastOptions(overrides = {}) {
    return {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: toastTheme(),
        ...overrides,
    };
}

export const notifySuccess = (message, options = {}) => {
    toast.success(message, buildToastOptions(options));
};

export const notifyError = (message) => {
    toast.error(
        message,
        buildToastOptions({
            autoClose: 3000,
        }),
    );
};

export const notifyInfo = (message) => {
    toast.info(message, buildToastOptions());
};
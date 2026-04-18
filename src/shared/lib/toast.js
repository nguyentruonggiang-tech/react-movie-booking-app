import { toast } from "react-toastify";

const baseConfig = {
    position: "top-right",
    autoClose: 2000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

export const notifySuccess = (message) => {
    toast.success(message, baseConfig);
};

export const notifyError = (message) => {
    toast.error(message, {
        ...baseConfig,
        autoClose: 3000,
    });
};

export const notifyInfo = (message) => {
    toast.info(message, baseConfig);
};
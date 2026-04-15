import Swal from "sweetalert2";
import { buildSwalOptions } from "./baseOptions";

export async function showSwalConfirm({
    title = "Confirm?",
    text = "Are you sure you want to perform this action?",
    icon = "warning",
    themeMode = "auto",
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
}) {
    const result = await Swal.fire(
        buildSwalOptions({
            title,
            text,
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

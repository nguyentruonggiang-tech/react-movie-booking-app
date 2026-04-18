import Swal from "sweetalert2";
import { buildSwalOptions } from "./baseOptions";

export async function showSwalConfirm({
    title = "Xác nhận?",
    text = "Bạn có chắc muốn thực hiện thao tác này?",
    icon = "warning",
    themeMode = "auto",
    confirmButtonText = "Xác nhận",
    cancelButtonText = "Hủy",
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

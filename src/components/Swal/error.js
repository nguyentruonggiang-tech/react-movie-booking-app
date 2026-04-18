import Swal from "sweetalert2";
import { buildSwalOptions } from "./baseOptions";

export async function showSwalError({
    title = "Đã có lỗi xảy ra",
    text,
    confirmButtonText = "Đóng",
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

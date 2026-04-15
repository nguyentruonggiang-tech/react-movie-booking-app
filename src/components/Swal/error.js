import Swal from "sweetalert2";
import { buildSwalOptions } from "./baseOptions";

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

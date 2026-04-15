import Swal from "sweetalert2";
import { buildSwalOptions } from "./baseOptions";

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

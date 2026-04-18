import { useEffect } from "react";
import { closeDialog, openLoading } from "@shared/lib/swal";

export default function AdminFallBack() {
    useEffect(() => {
        openLoading({
            title: "Đang tải…",
            text: "Vui lòng đợi trong giây lát.",
        });
        return () => {
            closeDialog();
        };
    }, []);

    return null;
}

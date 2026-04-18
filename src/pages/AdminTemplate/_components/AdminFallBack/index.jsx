import { useEffect } from "react";
import { closeDialog, openLoading } from "@shared/lib/swal";

export default function AdminFallBack() {
    useEffect(() => {
        openLoading({
            title: "Loading…",
            text: "Please wait a moment.",
        });
        return () => {
            closeDialog();
        };
    }, []);

    return null;
}

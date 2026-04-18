import { useEffect } from "react";
import { closeDialog, openLoading } from "@shared/lib/swal";

/**
 * Suspense fallback for lazy admin routes (e.g. profile chunk).
 * Uses SweetAlert loading to match other admin flows instead of LoadingOverlay.
 */
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

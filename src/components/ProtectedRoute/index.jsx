import { Suspense } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { buildLoginUrlWithRedirect } from "@/utils/navigation";
import { getAccessTokenFromLocalStorage } from "@/utils/storage";
import LoadingOverlay from "@components/LoadingOverlay";

export default function ProtectedRoute({ children }) {
    const location = useLocation();
    const accessToken = getAccessTokenFromLocalStorage();

    if (!accessToken) {
        return <Navigate to={buildLoginUrlWithRedirect(location)} replace />;
    }

    return <Suspense fallback={<LoadingOverlay message="Loading…" />}>{children}</Suspense>;
}

import { Suspense } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { actLogout } from "@pages/Auth/slice";
import { buildLoginUrlWithRedirect } from "@/utils/navigation";
import { getAccessTokenFromLocalStorage, isClientAccessTokenExpired } from "@/utils/storage";
import LoadingOverlay from "@components/LoadingOverlay";

export default function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const location = useLocation();
    const accessToken = getAccessTokenFromLocalStorage();

    if (!accessToken) {
        return <Navigate to={buildLoginUrlWithRedirect(location)} replace />;
    }

    if (isClientAccessTokenExpired()) {
        dispatch(actLogout());
        return <Navigate to={buildLoginUrlWithRedirect(location)} replace />;
    }

    return <Suspense fallback={<LoadingOverlay message="Đang tải…" />}>{children}</Suspense>;
}

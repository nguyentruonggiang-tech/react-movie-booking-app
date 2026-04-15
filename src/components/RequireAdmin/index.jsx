import { Navigate } from "react-router-dom";
import { USER_ROLE_ADMIN } from "@constants";
import { getUserRoleFromLocalStorage } from "@/utils/storage";

export default function RequireAdmin({ children }) {
    const userRole = getUserRoleFromLocalStorage();

    if (userRole !== USER_ROLE_ADMIN) {
        return <Navigate to="/" replace />;
    }

    return children;
}

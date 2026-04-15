import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@components/ProtectedRoute";
import RequireAdmin from "@components/RequireAdmin";

const routes = [
    {
        path: "",
        element: lazy(() => import("../pages/HomeTemplate")),
        nested: [
            {
                path: "",
                element: lazy(() => import("../pages/HomeTemplate/Home")),
            },
            {
                path: "detail/:maPhim",
                element: lazy(() => import("../pages/HomeTemplate/Detail")),
            },
            {
                path: "ticketroom/:maLichChieu",
                element: lazy(() => import("../pages/HomeTemplate/TicketRoom"))
            },
            {
                path: "profile",
                element: lazy(() => import("../pages/HomeTemplate/Profile")),
                requiresAuth: true,
            },
            {
                path: "news",
                element: lazy(() => import("../pages/HomeTemplate/News")),
            },
            {
                path: "about-us",
                element: lazy(() => import("../pages/HomeTemplate/AboutUs")),
            },
            {
                path: "privacy-policy",
                element: lazy(() => import("../pages/HomeTemplate/PrivacyPolicy")),
            },
            {
                path: "terms-of-service",
                element: lazy(() => import("../pages/HomeTemplate/TermsOfService")),
            },
            {
                path: "contact",
                element: lazy(() => import("../pages/HomeTemplate/Contact")),
            },
        ],
    },
    {
        path: "login",
        element: lazy(() => import("../pages/Auth/Login")),
    },
    {
        path: "register",
        element: lazy(() => import("../pages/Auth/Register")),
    },
    {
        path: "admin",
        element: lazy(() => import("../pages/AdminTemplate")),
        requiresAuth: true,
        requiresAdmin: true,
        nested: [
            {
                path: "",
                element: lazy(() => import("../pages/AdminTemplate/Dashboard")),
            },
            {
                path: "dashboard",
                element: lazy(() => import("../pages/AdminTemplate/Dashboard")),
            },
            {
                path: "films",
                element: lazy(() => import("../pages/AdminTemplate/Films")),
            },
            {
                path: "films/addnew",
                element: lazy(() => import("../pages/AdminTemplate/AddFilm")),
            },
            {
                path: "films/edit/:idFilm",
                element: lazy(() => import("../pages/AdminTemplate/EditFilm")),
            },
            {
                path: "films/showtime/:idFilm",
                element: lazy(() => import("../pages/AdminTemplate/ShowTime")),
            },
            {
                path: "users",
                element: lazy(() => import("../pages/AdminTemplate/Users")),
            },
            {
                path: "users/add",
                element: lazy(() => import("../pages/AdminTemplate/AddUser")),
            },
            {
                path: "users/edit/:taiKhoan",
                element: lazy(() => import("../pages/AdminTemplate/EditUser")),
            },
        ],
    },
    {
        path: "*",
        element: lazy(() => import("../pages/PageNotFound")),
    },
];

function nestedElement(item) {
    if (item.requiresAuth) {
        return (
            <ProtectedRoute>
                <item.element />
            </ProtectedRoute>
        );
    }
    return <item.element />;
}

export const renderRoutes = () => {
    return routes.map((route) => {
        if (route.nested) {
            const parentElement = route.requiresAuth ? (
                <ProtectedRoute>
                    {route.requiresAdmin ? (
                        <RequireAdmin>
                            <route.element />
                        </RequireAdmin>
                    ) : (
                        <route.element />
                    )}
                </ProtectedRoute>
            ) : (
                <route.element />
            );

            return (
                <Route key={route.path || "root"} path={route.path} element={parentElement}>
                    {route.nested.map((item) => (
                        <Route key={`${route.path}-${item.path}`} path={item.path} element={nestedElement(item)} />
                    ))}
                </Route>
            );
        }

        return <Route key={route.path} path={route.path} element={<route.element />} />;
    });
};

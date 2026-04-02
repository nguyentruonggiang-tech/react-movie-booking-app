import { lazy } from "react";
import { Route } from "react-router-dom";

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
                path: "login",
                element: lazy(() => import("../pages/HomeTemplate/Login")),
            },
            {
                path: "register",
                element: lazy(() => import("../pages/HomeTemplate/Register")),
            },
            {
                path: "detail/:maPhim",
                element: lazy(() => import("../pages/HomeTemplate/Detail")),
            },
            {
                path: "ticketroom/:maLichChieu",
                element: lazy(() => import("../pages/HomeTemplate/TicketRoom")),
            },
            {
                path: "profile",
                element: lazy(() => import("../pages/HomeTemplate/Profile")),
            },
        ],
    },
    {
        path: "admin",
        element: lazy(() => import("../pages/AdminTemplate")),
        nested: [
            {
                path: "",
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

export const renderRoutes = () => {
    return routes.map((route) => {
        if (route.nested) {
            return (
                <Route key={route.path || "root"} path={route.path} element={<route.element />}>
                    {route.nested.map((item) => (
                        <Route key={`${route.path}-${item.path}`} path={item.path} element={<item.element />} />
                    ))}
                </Route>
            );
        }

        return <Route key={route.path} path={route.path} element={<route.element />} />;
    });
};

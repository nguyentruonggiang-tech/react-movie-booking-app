import { BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ThemeSync from "@components/ThemeSync";
import { useAppTheme } from "@/hooks/useAppTheme";
import { renderRoutes } from "./routes/index.jsx";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const mode = useAppTheme();
    const toastifyTheme = mode === "dark" ? "dark" : "light";

    return (
        <BrowserRouter>
            <>
                <ThemeSync />
                <Routes>{renderRoutes()}</Routes>
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    closeOnClick={false}
                    draggable={false}
                    hideProgressBar={false}
                    newestOnTop
                    pauseOnHover
                    pauseOnFocusLoss={false}
                    limit={2}
                    theme={toastifyTheme}
                />
            </>
        </BrowserRouter>
    );
}

export default App

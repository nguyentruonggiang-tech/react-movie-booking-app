import { BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { renderRoutes } from "./routes/index.jsx";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <BrowserRouter>
            <>
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
                    theme="dark"
                />
            </>
        </BrowserRouter>
    );
}

export default App

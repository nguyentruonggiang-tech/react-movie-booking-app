import { Outlet } from "react-router-dom";
import Topbar from "./_components/Topbar";
import Sidebar from "./_components/Sidebar";
import Footer from "./_components/Footer";

export default function AdminTemplate() {
    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Cột trái */}
            <aside className="w-64 bg-white border-r border-gray-200">
                <Sidebar />
            </aside>
            {/* Cột phải */}
            <div className="flex-1">
                <header className="h-16 border-b bg-white px-4 flex items-center">
                    <Topbar />
                </header>
                <main className="p-6">
                    <Outlet />
                </main>
                <footer className="h-16 border-t bg-white px-4 flex items-center">
                    <Footer />
                </footer>
            </div>
        </div>
    )
}

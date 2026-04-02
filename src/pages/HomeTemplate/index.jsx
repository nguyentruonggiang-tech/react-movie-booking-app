import { Outlet } from "react-router-dom";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default function HomeTemplate() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <header className="h-16 border-b px-4 flex items-center">
                <Header />
            </header>

            <main className="flex-1 p-4">
                <Outlet />
            </main>

            <footer className="border-t px-4 py-3">
                <Footer />
            </footer>
        </div>
    );
}

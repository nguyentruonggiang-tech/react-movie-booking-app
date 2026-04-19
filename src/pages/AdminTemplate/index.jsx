import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import AdminFallBack from "./_components/AdminFallBack";
import TopBar from "./_components/TopBar";
import Footer from "./_components/Footer";
import Sidebar from "./_components/Sidebar";

export default function AdminTemplate() {
    return (
        <div className="flex min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <Sidebar />
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
                <TopBar />
                <main className="flex-1 grow p-6 lg:p-8">
                    <Suspense fallback={<AdminFallBack />}>
                        <Outlet />
                    </Suspense>
                </main>
                <Footer />
            </div>
        </div>
    );
}

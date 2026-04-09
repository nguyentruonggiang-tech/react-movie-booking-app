import { Outlet } from "react-router-dom";
import Header from "./_components/Header";
import { HOME_MAIN_PADDING_TOP_CLASS } from "./layout";
import Footer from "./_components/Footer";
export default function HomeTemplate() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased">
            <Header />
            
            <main className={`flex-1 pb-32 md:pb-28 ${HOME_MAIN_PADDING_TOP_CLASS}`}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

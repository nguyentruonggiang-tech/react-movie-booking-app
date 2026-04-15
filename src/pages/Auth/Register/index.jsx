import { Link } from "react-router-dom";
import LoginBackground from "../Login/LoginBackground";

export default function Register() {
    return (
        <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-[#030308] text-slate-100 antialiased md:flex-row">
            <LoginBackground className="pointer-events-none absolute inset-0 z-0 h-full min-h-screen w-full" />

            <div className="relative z-10 flex flex-1 flex-col justify-center bg-[#030712]/80 px-6 py-10 backdrop-blur-[4px] sm:px-10 md:px-12 lg:px-16">
                <div className="relative mx-auto w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold text-white lg:text-3xl">Create account</h1>
                    <p className="mt-3 text-sm text-slate-400">
                        Sign up will be available here. If you already have an account, sign in below.
                    </p>
                    <p className="mt-8 text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-red-400 underline-offset-2 transition hover:text-red-300 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

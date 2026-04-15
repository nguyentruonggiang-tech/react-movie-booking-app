import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { actLogin } from "@pages/Auth/slice";
import { getPathAfterLogin } from "@/utils/authRedirect";
import LoadingOverlay from "@components/LoadingOverlay";
import LoginBackground from "./LoginBackground";

const LOGIN_SUCCESS_TOAST_ID = "login-success-redirect";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, data, error } = useSelector((state) => state.authReducer);
 
    const initialData = { taiKhoan: "", matKhau: "" };
    const [user, setUser] = useState(initialData);
    const [errors, setErrors] = useState(initialData);
    const [showPassword, setShowPassword] = useState(false);
    const [hasSubmittedLogin, setHasSubmittedLogin] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const [searchParams] = useSearchParams();
    const redirectURLParam = searchParams.get("redirect");

    const handleOnchange = (event) => {
        const { name, value } = event.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = (event) => {
        const { name, value } = event.target;
        const inputValue = value.trim();

        let mess = "";

        switch (name) {
            case "taiKhoan":
                if (inputValue === "") {
                    mess = "Username is required";
                } else if (inputValue.length < 4) {
                    mess = "Username must be at least 4 characters";
                }
                break;
            case "matKhau":
                if (inputValue === "") {
                    mess = "Password is required";
                } else if (inputValue.length < 6) {
                    mess = "Password must be at least 6 characters";
                }
                break;
            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: mess }));
    };

    const isDisabled =
        (errors.taiKhoan) ||
        (errors.matKhau) ||
        !user.taiKhoan.trim() ||
        !user.matKhau.trim() ||
        loading ||
        isRedirecting;

    const handleLogin = (event) => {
        event.preventDefault();
        if (isDisabled) return;
        setHasSubmittedLogin(true);
        dispatch(actLogin(user));
    };

    useEffect(() => {
        if (!data) return;

        const nextPath = getPathAfterLogin(redirectURLParam, data.maLoaiNguoiDung);
        if (!hasSubmittedLogin) {
            navigate(nextPath, { replace: true });
            return;
        }

        const redirectingRafId = requestAnimationFrame(() => {
            setIsRedirecting(true);
        });

        toast.success(
            <div className="text-left">
                <p className="text-sm font-semibold text-white">Signed in successfully</p>
                <p className="mt-1 text-xs text-slate-400">Redirecting in a few seconds…</p>
            </div>,
            {
                toastId: LOGIN_SUCCESS_TOAST_ID,
                autoClose: 3000,
                closeOnClick: false,
                pauseOnHover: true,
                className: "login-toast login-toast--success",
            },
        );

        const redirectTimer = setTimeout(() => {
            navigate(nextPath, { replace: true });
        }, 3000);

        return () => {
            cancelAnimationFrame(redirectingRafId);
            clearTimeout(redirectTimer);
            toast.dismiss(LOGIN_SUCCESS_TOAST_ID);
            setIsRedirecting(false);
        };
    }, [data, hasSubmittedLogin, navigate, redirectRaw]);

    return (
        <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-[#030308] text-slate-100 antialiased md:flex-row">
            <LoginBackground className="pointer-events-none absolute inset-0 z-0 h-full min-h-screen w-full" />

            <div
                className="relative z-10 hidden min-h-[220px] flex-none flex-col justify-end md:flex md:min-h-0 md:w-[46%] lg:w-[50%]"
                aria-hidden
            >
                <div className="pointer-events-none flex h-full min-h-[520px] flex-col justify-end px-8 py-12 lg:px-12 lg:py-14">
                    <div className="max-w-sm text-balance rounded-2xl border border-white/15 bg-slate-950/55 px-5 py-6 text-center shadow-xl shadow-black/30 backdrop-blur-md md:text-left">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400/90 drop-shadow-sm">
                            Movie Booking
                        </p>
                        <h1 className="mt-3 text-2xl font-bold leading-snug text-white drop-shadow-md sm:text-3xl lg:text-[2rem] lg:leading-tight">
                            Sign in to continue your cinema journey
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300/95 drop-shadow-sm">
                            Seats are waiting — pick a film and showtime, and check out faster with an
                            account.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex flex-1 flex-col justify-center bg-[#030712]/80 px-6 py-10 shadow-[inset_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-[4px] sm:px-10 md:px-12 md:shadow-[-48px_0_96px_-32px_rgba(0,0,0,0.5)] lg:px-16">
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_0%_20%,rgba(254,243,199,0.09),transparent_52%)]"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-slate-950/40"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/35"
                    aria-hidden
                />
                <div className="relative mx-auto w-full max-w-md">
                    <div className="mb-8 md:hidden">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
                            Sign in
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-white">Welcome back</h2>
                    </div>

                    <div className="mb-10 hidden md:block">
                        <h2 className="text-2xl font-bold text-white lg:text-3xl">Sign in</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Enter your username and password.
                        </p>
                    </div>

                    {error ? (
                        <div
                            className="mb-6 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100"
                            role="alert"
                        >
                            {error}
                        </div>
                    ) : null}

                    <form
                        className="space-y-5"
                        onSubmit={handleLogin}
                        noValidate
                        aria-busy={loading || isRedirecting}
                    >
                        <div>
                            <label
                                htmlFor="login-taiKhoan"
                                className="mb-1.5 block text-sm font-medium text-slate-200"
                            >
                                Username
                            </label>
                            <input
                                id="login-taiKhoan"
                                name="taiKhoan"
                                type="text"
                                autoComplete="username"
                                value={user.taiKhoan}
                                onChange={handleOnchange}
                                onBlur={validateForm}
                                disabled={loading || isRedirecting}
                                className="block w-full rounded-lg border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-sm text-white shadow-inner outline-none ring-red-500/0 transition placeholder:text-slate-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                                placeholder="Username"
                            />
                            {errors.taiKhoan ? (
                                <p className="mt-1.5 text-xs text-red-400">{errors.taiKhoan}</p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="login-matKhau"
                                className="mb-1.5 block text-sm font-medium text-slate-200"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="login-matKhau"
                                    name="matKhau"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={user.matKhau}
                                    onChange={handleOnchange}
                                    onBlur={validateForm}
                                    disabled={loading || isRedirecting}
                                    className="block w-full rounded-lg border border-slate-700/80 bg-slate-950/90 px-4 py-3 pr-11 text-sm text-white shadow-inner outline-none ring-red-500/0 transition placeholder:text-slate-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    disabled={loading || isRedirecting}
                                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.8}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                            aria-hidden
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 3l18 18M10.73 5.08A10.97 10.97 0 0112 5c5.25 0 9.27 3.86 10 7-.27 1.17-1.02 2.45-2.13 3.6M6.61 6.61C4.63 7.9 3.3 9.73 3 12c.73 3.14 4.75 7 10 7 2.19 0 4.17-.67 5.78-1.74M9.88 9.88a3 3 0 104.24 4.24"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.8}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                            aria-hidden
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                                            />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.matKhau ? (
                                <p className="mt-1.5 text-xs text-red-400">{errors.matKhau}</p>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            disabled={isDisabled}
                            className={
                                loading || isRedirecting
                                    ? "flex w-full cursor-wait items-center justify-center rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/30"
                                    : "flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500 cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-60"
                            }
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-red-400 underline-offset-2 transition hover:text-red-300 hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </div>

                {loading ? <LoadingOverlay message="Signing in…" /> : null}
            </div>
        </div>
    );
}

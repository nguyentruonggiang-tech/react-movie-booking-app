import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { actLogin, clearLoginError } from "@pages/Auth/slice";
import { notifySuccess } from "@shared/lib/toast";
import { getPathAfterLogin } from "@/utils/authRedirect";
import { SITE_NAME } from "@constants";
import LoadingOverlay from "@components/LoadingOverlay";
import AuthThemeCorner from "../_components/AuthThemeCorner";
import LoginBackground from "../_components/LoginBackground";

const LOGIN_SUCCESS_TOAST_ID = "login-success-redirect";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, data, error } = useSelector((state) => state.authLoginReducer);
 
    const initialData = { taiKhoan: "", matKhau: "" };
    const [user, setUser] = useState(initialData);
    const [errors, setErrors] = useState(initialData);
    const [showPassword, setShowPassword] = useState(false);
    const [hasSubmittedLogin, setHasSubmittedLogin] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const [searchParams] = useSearchParams();
    const redirectURLParam = searchParams.get("redirect");

    useLayoutEffect(() => {
        dispatch(clearLoginError());
    }, [dispatch]);

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
                    mess = "Vui lòng nhập tên đăng nhập.";
                } else if (inputValue.length < 6) {
                    mess = "Tên đăng nhập cần ít nhất 6 ký tự.";
                }
                break;
            case "matKhau":
                if (inputValue === "") {
                    mess = "Vui lòng nhập mật khẩu.";
                } else if (inputValue.length < 6) {
                    mess = "Mật khẩu cần ít nhất 6 ký tự.";
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

        notifySuccess(
            <div className="text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Đăng nhập thành công</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Đang chuyển hướng sau vài giây…</p>
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
            setIsRedirecting(false);
        };
    }, [data, hasSubmittedLogin, navigate, redirectURLParam]);

    const hasExistingSession = Boolean(data?.accessToken) && !hasSubmittedLogin;
    if (hasExistingSession) {
        return (
            <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-slate-100 text-slate-900 antialiased dark:bg-[#030308] dark:text-slate-100 md:flex-row">
                <AuthThemeCorner />
                <LoginBackground className="pointer-events-none absolute inset-0 z-0 h-full min-h-screen w-full" />
                <LoadingOverlay message="Đang chuyển hướng…" />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-slate-100 text-slate-900 antialiased dark:bg-[#030308] dark:text-slate-100 md:flex-row">
            <AuthThemeCorner />
            <LoginBackground className="pointer-events-none absolute inset-0 z-0 h-full min-h-screen w-full" />

            <div
                className="relative z-10 hidden min-h-[220px] flex-none flex-col justify-end md:flex md:min-h-0 md:w-[46%] lg:w-[50%]"
                aria-hidden
            >
                <div className="pointer-events-none flex h-full min-h-[520px] flex-col justify-end px-8 py-12 lg:px-12 lg:py-14">
                    <div className="max-w-sm text-balance rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-6 text-center shadow-xl shadow-slate-900/10 backdrop-blur-md dark:border-white/15 dark:bg-slate-950/55 dark:shadow-black/30 md:text-left">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-600 drop-shadow-sm dark:text-red-400/90">
                            {SITE_NAME}
                        </p>
                        <h1 className="mt-3 text-2xl font-bold leading-snug text-slate-900 drop-shadow-sm dark:text-white dark:drop-shadow-md sm:text-3xl lg:text-[2rem] lg:leading-tight">
                            Đăng nhập để tiếp tục đặt vé xem phim
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 drop-shadow-sm dark:text-slate-300/95">
                            Chọn phim và suất chiếu, đặt ghế nhanh hơn khi bạn đã có tài khoản.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex flex-1 flex-col justify-center border-slate-200/80 bg-white/95 px-6 py-10 shadow-[inset_1px_0_0_rgba(15,23,42,0.06)] backdrop-blur-[4px] sm:px-10 md:px-12 md:shadow-[-48px_0_96px_-32px_rgba(15,23,42,0.12)] dark:border-transparent dark:bg-[#030712]/80 dark:shadow-[inset_1px_0_0_rgba(255,255,255,0.05)] dark:md:shadow-[-48px_0_96px_-32px_rgba(0,0,0,0.5)] lg:px-16">
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_0%_20%,rgba(254,243,199,0.22),transparent_52%)] dark:bg-[radial-gradient(ellipse_85%_70%_at_0%_20%,rgba(254,243,199,0.09),transparent_52%)]"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/70 via-transparent to-slate-100/85 dark:from-indigo-950/30 dark:via-transparent dark:to-slate-950/40"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/20 to-slate-400/30 dark:via-black/10 dark:to-black/35"
                    aria-hidden
                />
                <div className="relative mx-auto w-full max-w-md">
                    <div className="mb-8 md:hidden">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 dark:text-red-500">
                            Đăng nhập
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Chào mừng trở lại</h2>
                    </div>

                    <div className="mb-10 hidden md:block">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl">Đăng nhập</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Nhập tên đăng nhập và mật khẩu.
                        </p>
                    </div>

                    {error ? (
                        <div
                            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-100"
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
                                className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-100"
                            >
                                Tên đăng nhập
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
                                className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner outline-none ring-red-500/0 transition placeholder:text-slate-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700/80 dark:bg-slate-950/90 dark:text-white dark:placeholder:text-slate-500"
                                placeholder="Tên đăng nhập"
                            />
                            {errors.taiKhoan ? (
                                <p className="mt-1.5 text-xs text-red-400">{errors.taiKhoan}</p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="login-matKhau"
                                className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-100"
                            >
                                Mật khẩu
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
                                    className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-900 shadow-inner outline-none ring-red-500/0 transition placeholder:text-slate-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700/80 dark:bg-slate-950/90 dark:text-white dark:placeholder:text-slate-500"
                                    placeholder="Mật khẩu"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    disabled={loading || isRedirecting}
                                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-200"
                                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
                            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        Chưa có tài khoản?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-red-600 underline-offset-2 transition hover:text-red-700 hover:underline dark:text-red-400 dark:hover:text-red-300"
                        >
                            Đăng ký
                        </Link>
                    </p>
                </div>

                {loading ? <LoadingOverlay message="Đang đăng nhập…" /> : null}
            </div>
        </div>
    );
}

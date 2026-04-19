import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notifyError, notifySuccess } from "@shared/lib/toast";
import { getStoredUsername, mergeStoredUserFields } from "@/utils/storage";
import {
    fetchAccountProfile,
    profileSelectors,
    updateProfile,
} from "../slice";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_USERNAME_LENGTH = 6;
const MIN_PASSWORD_LENGTH = 6;

function inputShell(hasError) {
    const base =
        "w-full rounded-md border bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 " +
        "dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-500";
    const ok =
        "border-zinc-300 focus:border-rose-500 focus:ring-rose-500 dark:border-zinc-700 dark:focus:border-rose-500 dark:focus:ring-rose-500";
    const err =
        "border-red-500 focus:border-red-500 focus:ring-red-500/40 dark:border-red-500";
    return `${base} ${hasError ? err : ok}`;
}

function emptyProfileFormFields() {
    return {
        taiKhoan: "",
        email: "",
        matKhau: "",
        soDT: "",
        hoTen: "",
    };
}

function profileRecordToFormValues(record) {
    if (!record || typeof record !== "object") {
        return emptyProfileFormFields();
    }
    return {
        taiKhoan: String(record.taiKhoan ?? "").trim(),
        email: String(record.email ?? "").trim(),
        matKhau: String(record.matKhau ?? ""),
        hoTen: String(record.hoTen ?? "").trim(),
        soDT: String(record.soDT ?? record.soDt ?? "").trim(),
    };
}

export default function ProfileDetailsForm({ profile }) {
    const dispatch = useDispatch();
    const updateLoading = useSelector(profileSelectors.updateLoading);

    const [formValues, setFormValues] = useState(() =>
        profileRecordToFormValues(profile),
    );
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const displayName =
        String(formValues.hoTen || "").trim() ||
        String(formValues.taiKhoan || "").trim() ||
        "Người dùng";

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => {
            if (!prev[name]) {
                return prev;
            }
            const next = { ...prev };
            delete next[name];
            return next;
        });
    };

    function validateForm() {
        const nextErrors = {};
        const taiKhoan = String(formValues.taiKhoan ?? "").trim();
        if (!taiKhoan) {
            nextErrors.taiKhoan = "Vui lòng nhập tên đăng nhập.";
        } else if (taiKhoan.length < MIN_USERNAME_LENGTH) {
            nextErrors.taiKhoan = `Tên đăng nhập cần ít nhất ${MIN_USERNAME_LENGTH} ký tự.`;
        }

        const email = String(formValues.email ?? "").trim();
        if (!email) {
            nextErrors.email = "Vui lòng nhập email.";
        } else if (!EMAIL_REGEX.test(email)) {
            nextErrors.email = "Email không hợp lệ.";
        }

        const matKhau = String(formValues.matKhau ?? "");
        if (!matKhau.trim()) {
            nextErrors.matKhau = "Vui lòng nhập mật khẩu.";
        } else if (matKhau.length < MIN_PASSWORD_LENGTH) {
            nextErrors.matKhau = `Mật khẩu cần ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`;
        }

        const phoneNumber = String(formValues.soDT ?? "").trim();
        if (!phoneNumber) {
            nextErrors.soDT = "Vui lòng nhập số điện thoại.";
        }

        const hoTen = String(formValues.hoTen ?? "").trim();
        if (!hoTen) {
            nextErrors.hoTen = "Vui lòng nhập họ tên.";
        }

        return nextErrors;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validateForm();
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        const roleCode = String(profile?.maLoaiNguoiDung ?? "").trim();

        const updateBody = {
            taiKhoan: String(formValues.taiKhoan ?? "").trim(),
            email: String(formValues.email ?? "").trim(),
            soDT: String(formValues.soDT ?? "").trim(),
            hoTen: String(formValues.hoTen ?? "").trim(),
            matKhau: String(formValues.matKhau ?? ""),
            ...(roleCode ? { maLoaiNguoiDung: roleCode } : {}),
        };

        try {
            const saveResponse = await dispatch(updateProfile(updateBody)).unwrap();
            notifySuccess("Cập nhật hồ sơ thành công.");

            const phoneAfterSave = String(
                saveResponse?.soDT ??
                    saveResponse?.soDt ??
                    updateBody.soDT,
            ).trim();
            mergeStoredUserFields({
                hoTen: String(saveResponse?.hoTen ?? updateBody.hoTen).trim(),
                email: String(saveResponse?.email ?? updateBody.email).trim(),
                soDT: phoneAfterSave
            });

            const signedInUsername = getStoredUsername();
            if (signedInUsername) {
                try {
                    const refreshedProfile = await dispatch(
                        fetchAccountProfile(signedInUsername),
                    ).unwrap();
                    if (refreshedProfile && typeof refreshedProfile === "object") {
                        setFormValues(profileRecordToFormValues(refreshedProfile));
                        setFieldErrors({});
                    }
                } catch {}
            }
        } catch (rejectedMessage) {
            const message =
                typeof rejectedMessage === "string" &&
                rejectedMessage.trim() !== ""
                    ? rejectedMessage
                    : "Không thể cập nhật hồ sơ.";
            notifyError(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
                <div className="flex flex-col gap-6 border-b border-zinc-200 p-5 sm:flex-row sm:items-start sm:p-6 dark:border-zinc-800">
                    <div
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-2 border-rose-500/80 bg-rose-50 text-2xl font-bold uppercase text-rose-800 dark:bg-zinc-950 dark:text-rose-100"
                        aria-hidden
                    >
                        {displayName.slice(0, 2) || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl dark:text-white">
                            {displayName}
                        </h2>
                    </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                    <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
                        <label className="block min-w-0">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                                Tên đăng nhập <span className="text-red-600 dark:text-red-400">*</span>
                            </span>
                            <input
                                name="taiKhoan"
                                value={formValues.taiKhoan}
                                readOnly
                                autoComplete="username"
                                className={`${inputShell(Boolean(fieldErrors.taiKhoan))} cursor-not-allowed opacity-90`}
                            />
                            {fieldErrors.taiKhoan ? (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.taiKhoan}
                                </p>
                            ) : null}
                        </label>
                        <label className="block min-w-0">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                                Email <span className="text-red-600 dark:text-red-400">*</span>
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formValues.email}
                                onChange={handleChange}
                                autoComplete="email"
                                placeholder="email@example.com"
                                className={inputShell(Boolean(fieldErrors.email))}
                            />
                            {fieldErrors.email ? (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.email}
                                </p>
                            ) : null}
                        </label>
                        <label className="block min-w-0">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                                Mật khẩu <span className="text-red-600 dark:text-red-400">*</span>
                            </span>
                            <div className="relative w-full min-w-0">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="matKhau"
                                    value={formValues.matKhau ?? ""}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    placeholder="Mật khẩu"
                                    className={`${inputShell(
                                        Boolean(fieldErrors.matKhau),
                                    )} pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-500 transition hover:text-zinc-800 dark:hover:text-zinc-200"
                                    aria-label={
                                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                                    }
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.8}
                                            stroke="currentColor"
                                            className="h-4 w-4"
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
                                            className="h-4 w-4"
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
                            {fieldErrors.matKhau ? (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.matKhau}
                                </p>
                            ) : null}
                        </label>
                        <label className="block min-w-0">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                                Số điện thoại <span className="text-red-600 dark:text-red-400">*</span>
                            </span>
                            <input
                                name="soDT"
                                value={formValues.soDT}
                                onChange={handleChange}
                                autoComplete="tel"
                                inputMode="tel"
                                placeholder="Ví dụ: 0901234567"
                                className={inputShell(Boolean(fieldErrors.soDT))}
                            />
                            {fieldErrors.soDT ? (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.soDT}
                                </p>
                            ) : null}
                        </label>
                        <label className="block min-w-0">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                                Họ tên <span className="text-red-600 dark:text-red-400">*</span>
                            </span>
                            <input
                                name="hoTen"
                                value={formValues.hoTen}
                                onChange={handleChange}
                                autoComplete="name"
                                placeholder="Họ tên"
                                className={inputShell(Boolean(fieldErrors.hoTen))}
                            />
                            {fieldErrors.hoTen ? (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.hoTen}
                                </p>
                            ) : null}
                        </label>
                    </div>

                    <div className="flex justify-end border-t border-zinc-200 pt-5 dark:border-zinc-800">
                        <button
                            type="submit"
                            disabled={updateLoading}
                            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-rose-600 px-8 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md shadow-rose-900/30 transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {updateLoading ? "Đang cập nhật…" : "Cập nhật"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_USERNAME_LENGTH = 6;
const MIN_PASSWORD_LENGTH = 6;

function roleOptionLabel(row) {
    if (!row || typeof row !== "object") {
        return "";
    }
    const code = row.maLoaiNguoiDung ?? row.maLoai ?? "";
    const name =
        row.tenLoai ?? row.tenLoaiNguoiDung ?? row.ten ?? "";
    const label = String(name || code).trim();
    return label || String(code);
}

export default function UserForm({
    mode = "add",
    initialValues,
    onSubmit,
    submitText = "Thêm mới",
    loading,
    loadingLabel = "Đang cập nhật…",
    error,
    roleTypeOptions,
    roleTypesLoading,
    roleTypesError,
    onRetryRoleTypes,
    cancelTo = "/admin/users",
}) {
    const [formValues, setFormValues] = useState(() => initialValues);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const isEditMode = mode === "edit";

    const isSubmitting = Boolean(loading);
    const canSubmit = !isSubmitting;

    const handleTextChange = (event) => {
        const { name, value } = event.target;
        setFormValues((previous) => ({ ...previous, [name]: value }));
        setFieldErrors((previous) => {
            if (!previous[name]) {
                return previous;
            }
            const next = { ...previous };
            delete next[name];
            return next;
        });
    };

    const validateForm = () => {
        const nextErrors = {};
        const taiKhoan = String(formValues.taiKhoan ?? "").trim();
        if (!taiKhoan) {
            nextErrors.taiKhoan = "Vui lòng nhập tên đăng nhập.";
        } else if (
            !isEditMode &&
            taiKhoan.length < MIN_USERNAME_LENGTH
        ) {
            nextErrors.taiKhoan = `Tên đăng nhập phải có ít nhất ${MIN_USERNAME_LENGTH} ký tự.`;
        }

        const matKhau = String(formValues.matKhau ?? "");
        if (!matKhau) {
            nextErrors.matKhau = "Vui lòng nhập mật khẩu.";
        } else if (matKhau.length < MIN_PASSWORD_LENGTH) {
            nextErrors.matKhau = `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`;
        }

        const email = String(formValues.email ?? "").trim();
        if (!email) {
            nextErrors.email = "Vui lòng nhập email.";
        } else if (!EMAIL_REGEX.test(email)) {
            nextErrors.email = "Email không hợp lệ.";
        }

        const soDt = String(formValues.soDt ?? "").trim();
        if (!soDt) {
            nextErrors.soDt = "Vui lòng nhập số điện thoại.";
        }

        const hoTen = String(formValues.hoTen ?? "").trim();
        if (!hoTen) {
            nextErrors.hoTen = "Vui lòng nhập họ tên.";
        }

        const maLoai = String(formValues.maLoaiNguoiDung ?? "").trim();
        if (!maLoai) {
            nextErrors.maLoaiNguoiDung = "Vui lòng chọn loại người dùng.";
        }

        return nextErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nextErrors = validateForm();
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }
        onSubmit({
            taiKhoan: String(formValues.taiKhoan).trim(),
            matKhau: formValues.matKhau,
            email: String(formValues.email).trim(),
            soDt: String(formValues.soDt).trim(),
            hoTen: String(formValues.hoTen).trim(),
            maLoaiNguoiDung: String(formValues.maLoaiNguoiDung).trim(),
        });
    };

    const inputShell = (hasError) =>
        `w-full rounded-md border bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-1 dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${
            hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                : "border-zinc-300 focus:border-rose-500 focus:ring-rose-500 dark:border-zinc-700"
        }`;

    const selectShell = (hasError) =>
        `w-full cursor-pointer appearance-none rounded-md border bg-white px-3 py-2.5 pr-8 text-sm text-zinc-900 focus:outline-none focus:ring-1 dark:bg-zinc-950/50 dark:text-zinc-100 ${
            hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                : "border-zinc-300 focus:border-rose-500 focus:ring-rose-500 dark:border-zinc-700"
        }`;

    const safeRoleOptions = useMemo(
        () => (Array.isArray(roleTypeOptions) ? roleTypeOptions : []),
        [roleTypeOptions],
    );

    return (
        <form onSubmit={handleSubmit}>
            <fieldset
                disabled={isSubmitting}
                className="m-0 space-y-5 rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
                {roleTypesError ? (
                    <div className="flex flex-col gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between dark:border-amber-600/50 dark:bg-amber-950/20 dark:text-amber-100">
                        <span>{String(roleTypesError)}</span>
                        {typeof onRetryRoleTypes === "function" ? (
                            <button
                                type="button"
                                onClick={onRetryRoleTypes}
                                className="shrink-0 rounded-md border border-amber-500/70 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-900 transition hover:bg-amber-100 dark:border-amber-500/60 dark:bg-transparent dark:text-amber-100 dark:hover:bg-amber-900/40"
                            >
                                Thử lại
                            </button>
                        ) : null}
                    </div>
                ) : null}

                {error ? (
                    <div className="flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-500 dark:bg-red-500/10 dark:text-red-300">
                        <span className="text-red-600 dark:text-red-400" aria-hidden>
                            !
                        </span>
                        <span>{String(error)}</span>
                    </div>
                ) : null}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                            Tên đăng nhập <span className="text-red-600 dark:text-red-400">*</span>
                        </span>
                        <input
                            name="taiKhoan"
                            value={formValues.taiKhoan}
                            onChange={handleTextChange}
                            readOnly={isEditMode}
                            autoComplete="username"
                            placeholder="Tên đăng nhập duy nhất, tối thiểu 6 ký tự"
                            className={`${inputShell(Boolean(fieldErrors.taiKhoan))} ${
                                isEditMode ? "cursor-not-allowed opacity-90" : ""
                            }`}
                        />
                        {fieldErrors.taiKhoan ? (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.taiKhoan}</p>
                        ) : null}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                            Email <span className="text-red-600 dark:text-red-400">*</span>
                        </span>
                        <input
                            type="email"
                            name="email"
                            value={formValues.email}
                            onChange={handleTextChange}
                            autoComplete="email"
                            placeholder="email@example.com"
                            className={inputShell(Boolean(fieldErrors.email))}
                        />
                        {fieldErrors.email ? (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                        ) : null}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                            Mật khẩu <span className="text-red-600 dark:text-red-400">*</span>
                        </span>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="matKhau"
                                value={formValues.matKhau}
                                onChange={handleTextChange}
                                autoComplete="new-password"
                                placeholder="Tối thiểu 6 ký tự"
                                className={`${inputShell(Boolean(fieldErrors.matKhau))} pr-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                disabled={isSubmitting}
                                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-500 transition hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-zinc-200"
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
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.matKhau}</p>
                        ) : null}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                            Số điện thoại <span className="text-red-600 dark:text-red-400">*</span>
                        </span>
                        <input
                            name="soDt"
                            value={formValues.soDt}
                            onChange={handleTextChange}
                            autoComplete="tel"
                            inputMode="tel"
                            placeholder="VD: 0901234567"
                            className={inputShell(Boolean(fieldErrors.soDt))}
                        />
                        {fieldErrors.soDt ? (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.soDt}</p>
                        ) : null}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                            Họ tên <span className="text-red-600 dark:text-red-400">*</span>
                        </span>
                        <input
                            name="hoTen"
                            value={formValues.hoTen}
                            onChange={handleTextChange}
                            autoComplete="name"
                            placeholder="Họ tên"
                            className={inputShell(Boolean(fieldErrors.hoTen))}
                        />
                        {fieldErrors.hoTen ? (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.hoTen}</p>
                        ) : null}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-white">
                            Loại người dùng <span className="text-red-600 dark:text-red-400">*</span>
                        </span>
                        <select
                            name="maLoaiNguoiDung"
                            value={formValues.maLoaiNguoiDung}
                            onChange={handleTextChange}
                            disabled={roleTypesLoading}
                            className={selectShell(Boolean(fieldErrors.maLoaiNguoiDung))}
                        >
                            <option value="">
                                {roleTypesLoading
                                    ? "Đang tải vai trò…"
                                    : "Chọn vai trò"}
                            </option>
                            {safeRoleOptions.map((row) => {
                                const value = String(
                                    row.maLoaiNguoiDung ?? row.maLoai ?? "",
                                ).trim();
                                if (!value) {
                                    return null;
                                }
                                return (
                                    <option key={value} value={value}>
                                        {roleOptionLabel(row)}
                                    </option>
                                );
                            })}
                        </select>
                        {fieldErrors.maLoaiNguoiDung ? (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {fieldErrors.maLoaiNguoiDung}
                            </p>
                        ) : null}
                    </label>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                    <Link
                        to={cancelTo}
                        className="rounded-xl border border-zinc-300 bg-transparent px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-transparent dark:hover:text-white"
                    >
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="cursor-pointer rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md shadow-rose-900/30 transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? loadingLabel : submitText}
                    </button>
                </div>
            </fieldset>
        </form>
    );
}

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
    initialValues,
    onSubmit,
    submitText = "Create user",
    loading,
    error,
    roleTypeOptions,
    roleTypesLoading,
    roleTypesError,
    onRetryRoleTypes,
}) {
    const [formValues, setFormValues] = useState(() => initialValues);
    const [fieldErrors, setFieldErrors] = useState({});

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
            nextErrors.taiKhoan = "Username is required.";
        } else if (taiKhoan.length < MIN_USERNAME_LENGTH) {
            nextErrors.taiKhoan = `Username must be at least ${MIN_USERNAME_LENGTH} characters.`;
        }

        const matKhau = String(formValues.matKhau ?? "");
        if (!matKhau) {
            nextErrors.matKhau = "Password is required.";
        } else if (matKhau.length < MIN_PASSWORD_LENGTH) {
            nextErrors.matKhau = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
        }

        const email = String(formValues.email ?? "").trim();
        if (!email) {
            nextErrors.email = "Email is required.";
        } else if (!EMAIL_REGEX.test(email)) {
            nextErrors.email = "Email is not valid.";
        }

        const soDt = String(formValues.soDt ?? "").trim();
        if (!soDt) {
            nextErrors.soDt = "Phone number is required.";
        }

        const hoTen = String(formValues.hoTen ?? "").trim();
        if (!hoTen) {
            nextErrors.hoTen = "Full name is required.";
        }

        const maLoai = String(formValues.maLoaiNguoiDung ?? "").trim();
        if (!maLoai) {
            nextErrors.maLoaiNguoiDung = "User type is required.";
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
        `w-full rounded-md border bg-zinc-950/50 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${
            hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                : "border-zinc-700 focus:border-rose-500 focus:ring-rose-500"
        }`;

    const selectShell = (hasError) =>
        `w-full cursor-pointer appearance-none rounded-md border bg-zinc-950/50 px-3 py-2.5 pr-8 text-sm text-zinc-100 focus:outline-none focus:ring-1 ${
            hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                : "border-zinc-700 focus:border-rose-500 focus:ring-rose-500"
        }`;

    const safeRoleOptions = useMemo(
        () => (Array.isArray(roleTypeOptions) ? roleTypeOptions : []),
        [roleTypeOptions],
    );

    return (
        <form onSubmit={handleSubmit}>
            <fieldset
                disabled={isSubmitting}
                className="m-0 space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
            >
                {roleTypesError ? (
                    <div className="flex flex-col gap-2 rounded-md border border-amber-600/50 bg-amber-950/20 px-4 py-3 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between">
                        <span>{String(roleTypesError)}</span>
                        {typeof onRetryRoleTypes === "function" ? (
                            <button
                                type="button"
                                onClick={onRetryRoleTypes}
                                className="shrink-0 rounded-md border border-amber-500/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-100 transition hover:bg-amber-900/40"
                            >
                                Retry
                            </button>
                        ) : null}
                    </div>
                ) : null}

                {error ? (
                    <div className="flex items-center gap-2 rounded-md border border-red-500 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                        <span className="text-red-400" aria-hidden>
                            !
                        </span>
                        <span>{String(error)}</span>
                    </div>
                ) : null}
                
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                            Username <span className="text-red-400">*</span>
                        </span>
                        <input
                            name="taiKhoan"
                            value={formValues.taiKhoan}
                            onChange={handleTextChange}
                            autoComplete="username"
                            placeholder="Unique login, at least 6 characters"
                            className={inputShell(Boolean(fieldErrors.taiKhoan))}
                        />
                        {fieldErrors.taiKhoan ? (
                            <p className="mt-1 text-xs text-red-400">{fieldErrors.taiKhoan}</p>
                        ) : null}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                            Email <span className="text-red-400">*</span>
                        </span>
                        <input
                            type="email"
                            name="email"
                            value={formValues.email}
                            onChange={handleTextChange}
                            autoComplete="email"
                            placeholder="you@example.com"
                            className={inputShell(Boolean(fieldErrors.email))}
                        />
                        {fieldErrors.email ? (
                            <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                        ) : null}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                            Password <span className="text-red-400">*</span>
                        </span>
                        <input
                            type="password"
                            name="matKhau"
                            value={formValues.matKhau}
                            onChange={handleTextChange}
                            autoComplete="new-password"
                            placeholder="At least 6 characters"
                            className={inputShell(Boolean(fieldErrors.matKhau))}
                        />
                        {fieldErrors.matKhau ? (
                            <p className="mt-1 text-xs text-red-400">{fieldErrors.matKhau}</p>
                        ) : null}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                            Phone <span className="text-red-400">*</span>
                        </span>
                        <input
                            name="soDt"
                            value={formValues.soDt}
                            onChange={handleTextChange}
                            autoComplete="tel"
                            inputMode="tel"
                            placeholder="e.g. 0901234567"
                            className={inputShell(Boolean(fieldErrors.soDt))}
                        />
                        {fieldErrors.soDt ? (
                            <p className="mt-1 text-xs text-red-400">{fieldErrors.soDt}</p>
                        ) : null}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                            Full name <span className="text-red-400">*</span>
                        </span>
                        <input
                            name="hoTen"
                            value={formValues.hoTen}
                            onChange={handleTextChange}
                            autoComplete="name"
                            placeholder="Full name"
                            className={inputShell(Boolean(fieldErrors.hoTen))}
                        />
                        {fieldErrors.hoTen ? (
                            <p className="mt-1 text-xs text-red-400">{fieldErrors.hoTen}</p>
                        ) : null}
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                            User type <span className="text-red-400">*</span>
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
                                    ? "Loading roles…"
                                    : "Select user role"}
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
                            <p className="mt-1 text-xs text-red-400">
                                {fieldErrors.maLoaiNguoiDung}
                            </p>
                        ) : null}
                    </label>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-800 pt-4">
                    <Link
                        to="/admin/users"
                        className="rounded-xl border border-zinc-600 bg-transparent px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="cursor-pointer rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md shadow-rose-900/30 transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating…" : submitText}
                    </button>
                </div>
            </fieldset>
        </form>
    );
}

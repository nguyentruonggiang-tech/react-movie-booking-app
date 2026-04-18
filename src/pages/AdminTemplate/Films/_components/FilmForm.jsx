import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarMonth } from "flowbite-react-icons/outline";
import { MA_NHOM } from "@constants";
import { validateFile } from "@utils/fileUtils";
import { formatDate } from "@utils/dateUtils";
import { clampNumber } from "@utils/numberUtils";
import RatingBadge from "@/pages/AdminTemplate/_components/RatingBade";

const POSTER_FILE_ALLOWED_EXTENSIONS = ["jpg", "png", "gif"];
const POSTER_FILE_MAX_SIZE_MB = 10;

const POSTER_FILE_VALIDATE_OPTIONS = {
    extensions: POSTER_FILE_ALLOWED_EXTENSIONS,
    maxSize: POSTER_FILE_MAX_SIZE_MB,
};

export default function FilmForm({
    mode,
    film,
    initialValues,
    onSubmit,
    submitText,
    loading,
    error,
}) {
    const isEdit = mode === "edit";

    const [formValues, setFormValues] = useState(() => initialValues);
    const [serverPosterUrl, setServerPosterUrl] = useState(() =>
        isEdit ? String(film?.hinhAnh || "") : "",
    );
    const [posterFile, setPosterFile] = useState(null);
    const [posterPreview, setPosterPreview] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const posterInputRef = useRef(null);
    const releaseDateInputRef = useRef(null);

    const posterDisplaySrc = posterPreview || serverPosterUrl || "";

    const canSubmit = useMemo(() => !loading, [loading]);
    const isSubmitting = loading;

    useEffect(() => {
        return () => {
            if (posterPreview) {
                URL.revokeObjectURL(posterPreview);
            }
        };
    }, [posterPreview]);

    const handleTextChange = (event) => {
        const { name, value } = event.target;
        setFormValues((previous) => ({ ...previous, [name]: value }));
        setFieldErrors((previous) => {
            if (!previous[name]) return previous;
            const next = { ...previous };
            delete next[name];
            return next;
        });
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setFormValues((previous) => ({ ...previous, [name]: checked }));
    };

    const handlePosterChange = (event) => {
        const nextFile = event.target.files?.[0] ?? null;
        if (!nextFile) {
            setPosterFile(null);
            if (posterPreview) {
                URL.revokeObjectURL(posterPreview);
            }
            setPosterPreview("");
            return;
        }
        const posterCheckResult = validateFile(
            nextFile,
            POSTER_FILE_VALIDATE_OPTIONS,
        );
        if (!posterCheckResult.valid) {
            setFieldErrors((previous) => ({
                ...previous,
                posterFile:
                    posterCheckResult.error || "File poster không hợp lệ.",
            }));
            if (posterInputRef.current) {
                posterInputRef.current.value = "";
            }
            return;
        }
        setFieldErrors((previous) => {
            if (!previous.posterFile) return previous;
            const next = { ...previous };
            delete next.posterFile;
            return next;
        });
        if (posterPreview) {
            URL.revokeObjectURL(posterPreview);
        }
        setPosterFile(nextFile);
        const previewUrl = URL.createObjectURL(nextFile);
        setPosterPreview(previewUrl);
    };

    const handleRemovePoster = () => {
        if (isEdit) {
            if (posterFile || posterPreview) {
                setPosterFile(null);
                if (posterPreview) {
                    URL.revokeObjectURL(posterPreview);
                }
                setPosterPreview("");
                if (posterInputRef.current) {
                    posterInputRef.current.value = "";
                }
            } else {
                setServerPosterUrl("");
            }
        } else {
            setPosterFile(null);
            if (posterPreview) {
                URL.revokeObjectURL(posterPreview);
            }
            setPosterPreview("");
            if (posterInputRef.current) {
                posterInputRef.current.value = "";
            }
        }
        setFieldErrors((previous) => {
            if (!previous.posterFile) return previous;
            const next = { ...previous };
            delete next.posterFile;
            return next;
        });
    };

    const handleOpenReleaseDatePicker = () => {
        if (!releaseDateInputRef.current) return;
        if (typeof releaseDateInputRef.current.showPicker === "function") {
            try {
                releaseDateInputRef.current.showPicker();
                return;
            } catch {
                void 0;
            }
        }
        releaseDateInputRef.current.focus();
    };

    const validateForm = () => {
        const nextErrors = {};
        if (!formValues.tenPhim.trim()) {
            nextErrors.tenPhim = "Vui lòng nhập tên phim.";
        }
        if (!formValues.ngayKhoiChieu) {
            nextErrors.ngayKhoiChieu = "Vui lòng chọn ngày khởi chiếu.";
        }
        if (isEdit) {
            if (!posterFile && !String(serverPosterUrl || "").trim()) {
                nextErrors.posterFile = "Vui lòng chọn poster.";
            }
        } else if (!posterFile) {
            nextErrors.posterFile = "Vui lòng chọn poster.";
        }
        if (posterFile) {
            const posterCheck = validateFile(
                posterFile,
                POSTER_FILE_VALIDATE_OPTIONS,
            );
            if (!posterCheck.valid) {
                nextErrors.posterFile =
                    posterCheck.error || "File poster không hợp lệ.";
            }
        }
        return nextErrors;
    };

    const buildFormData = () => {
        const requestFormData = new FormData();
        if (isEdit) {
            requestFormData.append("maPhim", String(film.maPhim));
        }
        requestFormData.append("tenPhim", formValues.tenPhim.trim());
        requestFormData.append("trailer", formValues.trailer.trim());
        requestFormData.append("moTa", formValues.moTa.trim());
        requestFormData.append(
            "maNhom",
            MA_NHOM || (isEdit ? film.maNhom : null) || "GP01",
        );
        requestFormData.append(
            "ngayKhoiChieu",
            formatDate(String(formValues.ngayKhoiChieu ?? "").trim(), "dd/MM/yyyy"),
        );
        requestFormData.append("sapChieu", String(formValues.sapChieu));
        requestFormData.append("dangChieu", String(formValues.dangChieu));
        requestFormData.append("hot", String(formValues.hot));
        requestFormData.append(
            "danhGia",
            String(clampNumber(formValues.danhGia, 1, 10)),
        );
        if (posterFile) {
            requestFormData.append(
                "hinhAnh",
                posterFile,
                posterFile.name || "poster.jpg",
            );
        } else if (isEdit && serverPosterUrl) {
            requestFormData.append("hinhAnh", serverPosterUrl);
        }
        return requestFormData;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validateForm();
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }
        const requestFormData = buildFormData();
        await onSubmit(requestFormData);
    };

    const posterAsideEmptyHint = isEdit
        ? "Chưa có poster — tải file ở trên."
        : "Chưa chọn file.";

    return (
        <form onSubmit={handleSubmit}>
            <fieldset
                disabled={isSubmitting}
                className="m-0 grid w-full grid-cols-1 gap-6 border-0 p-0 xl:grid-cols-12 xl:items-stretch"
            >
                    <aside className="xl:col-span-4 xl:h-full">
                        <div className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                            <button
                                type="button"
                                onClick={() => posterInputRef.current?.click()}
                                className={`group relative block w-full flex-1 overflow-hidden rounded-xl border bg-zinc-950 transition ${
                                    fieldErrors.posterFile
                                        ? "border-red-500 hover:border-red-400"
                                        : "border-zinc-700 hover:border-rose-500/70"
                                }`}
                            >
                                {posterDisplaySrc ? (
                                    <>
                                        <img
                                            src={posterDisplaySrc}
                                            alt="Xem trước poster"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='48'%3E%3Crect fill='%233f3f46' width='36' height='48'/%3E%3C/svg%3E";
                                            }}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-left">
                                            <p className="text-center text-xs font-semibold uppercase tracking-wide text-white">
                                                Bấm để đổi poster
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-600 bg-zinc-800 text-2xl text-zinc-200">
                                            +
                                        </div>
                                        <p className="text-lg font-bold text-white">
                                            Tải poster{" "}
                                            <span className="text-red-400">*</span>
                                        </p>
                                        <p className="text-sm text-zinc-300">
                                            JPG, PNG, GIF (khuyến nghị 1000x1500px, tối đa {POSTER_FILE_MAX_SIZE_MB}MB)
                                        </p>

                                        <span className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 transition group-hover:border-rose-500 group-hover:text-white">
                                            Chọn file
                                        </span>
                                    </div>
                                )}
                            </button>
                            <input
                                ref={posterInputRef}
                                type="file"
                                accept=".jpg,.png,.gif"
                                onChange={handlePosterChange}
                                className="sr-only"
                            />
                            <div className="mt-3 flex min-h-8 items-center justify-center">
                                {posterDisplaySrc ? (
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                posterInputRef.current?.click()
                                            }
                                            className="rounded-md border border-rose-600/70 bg-rose-600/15 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-200 transition hover:bg-rose-600/25"
                                        >
                                            Đổi
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemovePoster}
                                            className="rounded-md border border-zinc-600 bg-zinc-800/60 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
                                        >
                                            Xóa ảnh
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-500">
                                        {posterAsideEmptyHint}
                                    </p>
                                )}
                            </div>
                            {fieldErrors.posterFile ? (
                                <p className="mt-1 text-center text-xs text-red-400">
                                    {fieldErrors.posterFile}
                                </p>
                            ) : null}
                        </div>
                    </aside>

                    <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-5 xl:col-span-8 xl:h-full">
                        {error ? (
                            <div className="mb-4 flex items-center gap-2 rounded-md border border-red-500 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-5 w-5 flex-shrink-0 text-red-400"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                                    />
                                </svg>
                                <span>{String(error)}</span>
                            </div>
                        ) : null}

                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                                Tên phim <span className="text-red-400">*</span>
                            </span>
                            <input
                                name="tenPhim"
                                value={formValues.tenPhim}
                                onChange={handleTextChange}
                                placeholder="Nhập tên phim chính thức…"
                                className={`w-full rounded-md border bg-zinc-950/50 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${
                                    fieldErrors.tenPhim
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                        : "border-zinc-700 focus:border-rose-500 focus:ring-rose-500"
                                }`}
                            />
                            {fieldErrors.tenPhim ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {fieldErrors.tenPhim}
                                </p>
                            ) : null}
                        </label>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                                    Ngày khởi chiếu <span className="text-red-400">*</span>
                                </span>
                                <div
                                    className={`flex items-center overflow-hidden rounded-md border bg-zinc-950/50 ${
                                        fieldErrors.ngayKhoiChieu
                                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/40"
                                            : "border-zinc-700 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500"
                                    }`}
                                >
                                    <input
                                        ref={releaseDateInputRef}
                                        type="date"
                                        name="ngayKhoiChieu"
                                        value={formValues.ngayKhoiChieu}
                                        onChange={handleTextChange}
                                        className="w-full appearance-none border-none bg-transparent px-3 py-2.5 text-sm text-zinc-100 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0 focus:border-none focus:outline-none focus:ring-0 focus:shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleOpenReleaseDatePicker}
                                        className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center border-l border-zinc-700/80 text-zinc-100 transition hover:bg-zinc-800/60 hover:text-white"
                                        aria-label="Mở chọn ngày khởi chiếu"
                                    >
                                        <CalendarMonth className="h-4 w-4" aria-hidden />
                                    </button>
                                </div>
                                {fieldErrors.ngayKhoiChieu ? (
                                    <p className="mt-1 text-xs text-red-400">
                                        {fieldErrors.ngayKhoiChieu}
                                    </p>
                                ) : null}
                            </label>

                            <label className="block">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="block text-xs font-semibold uppercase tracking-wide text-white">
                                        Đánh giá
                                    </span>
                                    <RatingBadge value={clampNumber(formValues.danhGia, 1, 10)} />
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    step={1}
                                    name="danhGia"
                                    value={clampNumber(formValues.danhGia, 1, 10)}
                                    onChange={handleTextChange}
                                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-rose-400 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-rose-400 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-400"
                                />
                                <div className="relative mt-1 h-4 text-[11px] text-zinc-500">
                                    <span className="absolute left-0">1</span>
                                    <span className="absolute left-[44.444%] -translate-x-1/2">
                                        5
                                    </span>
                                    <span className="absolute right-0">10</span>
                                </div>
                            </label>
                        </div>

                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                                URL trailer
                            </span>
                            <input
                                name="trailer"
                                value={formValues.trailer}
                                onChange={handleTextChange}
                                placeholder="https://youtube.com/..."
                                className="w-full rounded-md border border-zinc-700 bg-zinc-950/50 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                                Mô tả
                            </span>
                            <textarea
                                rows={5}
                                name="moTa"
                                value={formValues.moTa}
                                onChange={handleTextChange}
                                placeholder="Nhập mô tả hấp dẫn cho khán giả…"
                                className="w-full rounded-md border border-zinc-700 bg-zinc-950/50 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                        </label>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <label className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-200">
                                        Đang chiếu
                                    </span>
                                    <span className="relative inline-flex h-6 w-11 items-center">
                                        <input
                                            type="checkbox"
                                            name="dangChieu"
                                            checked={formValues.dangChieu}
                                            onChange={handleCheckboxChange}
                                            className="peer sr-only"
                                        />
                                        <span className="h-6 w-11 rounded-xl bg-zinc-700 transition-colors peer-checked:bg-rose-600" />
                                        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-lg bg-white transition-transform peer-checked:translate-x-5" />
                                    </span>
                                </span>
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-200">
                                        Sắp chiếu
                                    </span>
                                    <span className="relative inline-flex h-6 w-11 items-center">
                                        <input
                                            type="checkbox"
                                            name="sapChieu"
                                            checked={formValues.sapChieu}
                                            onChange={handleCheckboxChange}
                                            className="peer sr-only"
                                        />
                                        <span className="h-6 w-11 rounded-xl bg-zinc-700 transition-colors peer-checked:bg-rose-600" />
                                        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-lg bg-white transition-transform peer-checked:translate-x-5" />
                                    </span>
                                </span>
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-200">
                                        Nổi bật
                                    </span>
                                    <span className="relative inline-flex h-6 w-11 items-center">
                                        <input
                                            type="checkbox"
                                            name="hot"
                                            checked={formValues.hot}
                                            onChange={handleCheckboxChange}
                                            className="peer sr-only"
                                        />
                                        <span className="h-6 w-11 rounded-xl bg-zinc-700 transition-colors peer-checked:bg-rose-600" />
                                        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-lg bg-white transition-transform peer-checked:translate-x-5" />
                                    </span>
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
                            <Link
                                to="/admin/films"
                                className="rounded-xl border border-transparent px-4 py-2 text-sm font-medium text-zinc-300 transition hover:text-white"
                            >
                                Hủy
                            </Link>
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="cursor-pointer rounded-xl bg-rose-500 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? isEdit
                                        ? "Đang cập nhật…"
                                        : "Đang thêm phim…"
                                    : submitText}
                            </button>
                        </div>
                    </section>
            </fieldset>
        </form>
    );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CalendarMonth, ChevronLeft } from "flowbite-react-icons/outline";
import { MA_NHOM } from "@constants";
import { createFilm, resetCreateFilmState } from "./slice";

const initialFormValues = {
    tenPhim: "",
    trailer: "",
    moTa: "",
    ngayKhoiChieu: "",
    sapChieu: true,
    dangChieu: true,
    hot: true,
    danhGia: 5,
};

function formatDateToApiValue(dateValue) {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function normalizeRating(value) {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return 1;
    if (parsed < 1) return 1;
    if (parsed > 10) return 10;
    return parsed;
}

function isAllowedPosterFile(file) {
    if (!file) return false;
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.type)) return true;
    const lowerName = String(file.name || "").toLowerCase();
    return (
        lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || lowerName.endsWith(".png") || lowerName.endsWith(".gif")
    );
}

export default function AddFilm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, data } = useSelector(
        (state) => state.addFilmReducer,
    );

    const [formValues, setFormValues] = useState(initialFormValues);
    const [posterFile, setPosterFile] = useState(null);
    const [posterPreview, setPosterPreview] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const posterInputRef = useRef(null);
    const releaseDateInputRef = useRef(null);

    const canSubmit = useMemo(() => !loading, [loading]);
    const isSubmitting = loading;

    useEffect(() => {
        return () => {
            dispatch(resetCreateFilmState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (!data) return;
        toast.success("Film created successfully.");
        dispatch(resetCreateFilmState());
        navigate("/admin/films");
    }, [data, dispatch, navigate]);

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
        if (!isAllowedPosterFile(nextFile)) {
            setFieldErrors((previous) => ({
                ...previous,
                posterFile: "Poster file must be .jpg, .png, or .gif.",
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
        setPosterFile(null);
        if (posterPreview) {
            URL.revokeObjectURL(posterPreview);
        }
        setPosterPreview("");
        if (posterInputRef.current) {
            posterInputRef.current.value = "";
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
                // Fall through to focus when browser blocks showPicker.
            }
        }
        releaseDateInputRef.current.focus();
    };

    const validateForm = () => {
        const nextErrors = {};
        if (!formValues.tenPhim.trim()) {
            nextErrors.tenPhim = "Film title is required.";
        }
        if (!formValues.ngayKhoiChieu) {
            nextErrors.ngayKhoiChieu = "Release date is required.";
        }
        if (!posterFile) {
            nextErrors.posterFile = "Poster image is required.";
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
        
        const requestFormData = new FormData();
        requestFormData.append("tenPhim", formValues.tenPhim.trim());
        requestFormData.append("trailer", formValues.trailer.trim());
        requestFormData.append("moTa", formValues.moTa.trim());
        requestFormData.append("maNhom", MA_NHOM || "GP01");
        requestFormData.append("ngayKhoiChieu", formatDateToApiValue(formValues.ngayKhoiChieu));
        requestFormData.append("sapChieu", String(formValues.sapChieu));
        requestFormData.append("dangChieu", String(formValues.dangChieu));
        requestFormData.append("hot", String(formValues.hot));
        requestFormData.append("danhGia", String(normalizeRating(formValues.danhGia)));
        if (posterFile) {
            requestFormData.append("hinhAnh", posterFile, posterFile.name || "poster.jpg");
        }
        dispatch(createFilm(requestFormData)); 
    };

    return (
        <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
                <p className="text-sm text-zinc-400">Admin &gt; Film management</p>
                <div className="mt-2 flex items-start justify-between gap-4">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-white">Add Film</h1>
                    <Link
                        to="/admin/films"
                        className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-200 transition hover:border-rose-500 hover:text-white"
                    >
                        <ChevronLeft className="mr-1 h-3.5 w-3.5" aria-hidden />
                        Back to film list
                    </Link>
                </div>
                <div className="mt-3 h-1 w-20 rounded-full bg-rose-500" />
            </div>

            <form onSubmit={handleSubmit}>
                <fieldset disabled={isSubmitting} className="contents">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-stretch">
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
                                {posterPreview ? (
                                    <>
                                        <img
                                            src={posterPreview}
                                            alt="Poster preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-left">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-white text-center">
                                                Click to change poster
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-600 bg-zinc-800 text-2xl text-zinc-200">
                                            +
                                        </div>
                                        <p className="text-lg font-bold text-white">
                                            Upload Poster <span className="text-red-400">*</span>
                                        </p>
                                        <p className="text-sm text-zinc-300">JPG, PNG, GIF (recommended 1000x1500px)</p>
                                   
                                        <span className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 transition group-hover:border-rose-500 group-hover:text-white">
                                            Choose file
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
                                {posterFile ? (
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => posterInputRef.current?.click()}
                                            className="rounded-md border border-rose-600/70 bg-rose-600/15 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-200 transition hover:bg-rose-600/25"
                                        >
                                            Change
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemovePoster}
                                            className="rounded-md border border-zinc-600 bg-zinc-800/60 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-500">No file selected.</p>
                                )}
                            </div>
                            {fieldErrors.posterFile ? (
                                <p className="mt-1 text-center text-xs text-red-400">{fieldErrors.posterFile}</p>
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
                                Film title <span className="text-red-400">*</span>
                            </span>
                            <input
                                name="tenPhim"
                                value={formValues.tenPhim}
                                onChange={handleTextChange}
                                placeholder="Enter official film title..."
                                className={`w-full rounded-md border bg-zinc-950/50 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${
                                    fieldErrors.tenPhim
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                                        : "border-zinc-700 focus:border-rose-500 focus:ring-rose-500"
                                }`}
                            />
                            {fieldErrors.tenPhim ? (
                                <p className="mt-1 text-xs text-red-400">{fieldErrors.tenPhim}</p>
                            ) : null}
                        </label>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                                    Release date <span className="text-red-400">*</span>
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
                                        aria-label="Open release date picker"
                                    >
                                        <CalendarMonth className="h-4 w-4" aria-hidden />
                                    </button>
                                </div>
                                {fieldErrors.ngayKhoiChieu ? (
                                    <p className="mt-1 text-xs text-red-400">{fieldErrors.ngayKhoiChieu}</p>
                                ) : null}
                            </label>

                            <label className="block">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="block text-xs font-semibold uppercase tracking-wide text-white">
                                        Rating
                                    </span>
                                    <span className="rounded-md border border-rose-600/60 bg-rose-600/15 px-2 py-0.5 text-xs font-semibold text-rose-200">
                                        {normalizeRating(formValues.danhGia)}/10
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    step={1}
                                    name="danhGia"
                                    value={normalizeRating(formValues.danhGia)}
                                    onChange={handleTextChange}
                                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-rose-400 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-rose-400 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-400"
                                />
                                <div className="relative mt-1 h-4 text-[11px] text-zinc-500">
                                    <span className="absolute left-0">1</span>
                                    <span className="absolute left-[44.444%] -translate-x-1/2">5</span>
                                    <span className="absolute right-0">10</span>
                                </div>
                            </label>
                        </div>

                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white">
                                Trailer URL
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
                                Description
                            </span>
                            <textarea
                                rows={5}
                                name="moTa"
                                value={formValues.moTa}
                                onChange={handleTextChange}
                                placeholder="Write an engaging summary to attract viewers..."
                                className="w-full rounded-md border border-zinc-700 bg-zinc-950/50 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                        </label>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <label className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-200">Now showing</span>
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
                                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-200">Coming soon</span>
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
                                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-200">Hot</span>
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
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="rounded-xl bg-rose-500 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-rose-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Adding Film..." : "Add film"}
                            </button>
                        </div>
                    </section>
                </div>
                </fieldset>
            </form>
        </div>
    );
}

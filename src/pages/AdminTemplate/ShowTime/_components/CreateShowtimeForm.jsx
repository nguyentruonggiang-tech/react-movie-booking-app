import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CalendarMonth, Clock } from "flowbite-react-icons/outline";
import { notifyError, notifySuccess } from "@shared/lib/toast";
import {
    adminShowtimeSelectors,
    clearAdminShowtimeCreateError,
    createAdminShowtime,
    fetchAdminShowtimePhimSchedule,
    fetchShowtimeCumRapTheoHeThong,
    fetchShowtimeHeThongRap,
} from "../slice";
import { formatDate } from "@utils/dateUtils";
import { errTextClass, inputClass, labelClass } from "./constants";

export default function CreateShowtimeForm({ ngayChieu, onNgayChieuChange }) {
    const { idFilm } = useParams();
    const dispatch = useDispatch();

    const movieState = useSelector(adminShowtimeSelectors.movie);
    const createState = useSelector(adminShowtimeSelectors.create);
    const showtimeSystemsState = useSelector(adminShowtimeSelectors.systems);
    const showtimeClustersState = useSelector(adminShowtimeSelectors.clusters);

    const [maHeThongRap, setMaHeThongRap] = useState("");
    const [maCumRap, setMaCumRap] = useState("");
    const [gioBatDau, setGioBatDau] = useState("");
    const [giaVe, setGiaVe] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const ngayChieuInputRef = useRef(null);
    const gioBatDauInputRef = useRef(null);

    const systems = Array.isArray(showtimeSystemsState?.data)
        ? showtimeSystemsState.data
        : [];
    const clusters = Array.isArray(showtimeClustersState?.data)
        ? showtimeClustersState.data
        : [];

    const minScreeningDateIso = formatDate(new Date());

    useEffect(() => {
        dispatch(fetchShowtimeHeThongRap());
    }, [dispatch]);

    useEffect(() => {
        if (!maHeThongRap) return;
        dispatch(fetchShowtimeCumRapTheoHeThong(maHeThongRap));
    }, [dispatch, maHeThongRap]);

    const movie = movieState.data;
    const maPhimApi = movie?.maPhim ?? idFilm;

    const buildNgayChieuGioChieu = useCallback(() => {
        const d = String(ngayChieu ?? "").trim();
        const t = String(gioBatDau ?? "").trim();
        const dateMatch = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        const timeMatch = t.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
        if (!dateMatch || !timeMatch) return "";
        const [, yyyy, MM, dd] = dateMatch;
        const [, hh, mm, ssRaw] = timeMatch;
        const ss = ssRaw ?? "00";
        return `${dd}/${MM}/${yyyy} ${hh}:${mm}:${ss}`;
    }, [ngayChieu, gioBatDau]);

    function validateForm() {
        const next = {};
        if (!maHeThongRap) next.maHeThongRap = "Chọn hệ thống rạp.";
        if (!maCumRap) next.maCumRap = "Chọn cụm rạp.";
        if (!ngayChieu) next.ngayChieu = "Chọn ngày chiếu.";
        if (!gioBatDau) next.gioBatDau = "Chọn giờ bắt đầu.";

        const maPhimNum = Number(maPhimApi);
        if (!Number.isFinite(maPhimNum) || maPhimNum <= 0) {
            next.maPhim = "Mã phim không hợp lệ.";
        }

        const priceNum = Number(String(giaVe).replace(/,/g, "").trim());
        if (!Number.isFinite(priceNum) || priceNum <= 0) {
            next.giaVe = "Nhập giá vé hợp lệ.";
        }

        const day = String(ngayChieu ?? "").trim();
        if (!next.ngayChieu && /^\d{4}-\d{2}-\d{2}$/.test(day) && day < minScreeningDateIso) {
            next.ngayChieu = "Chỉ được chọn hôm nay hoặc ngày tương lai.";
        }

        const ngayGio = buildNgayChieuGioChieu();
        if (!ngayGio && !next.ngayChieu) {
            next.ngayChieu = "Ngày/giờ không hợp lệ.";
        }

        return next;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearAdminShowtimeCreateError());
        const nextErrors = validateForm();
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        const ngayChieuGioChieu = buildNgayChieuGioChieu();
        const priceNum = Number(String(giaVe).replace(/,/g, "").trim());
        const maPhimNum = Number(maPhimApi);

        try {
            await dispatch(
                createAdminShowtime({
                    maPhim: maPhimNum,
                    maCumRap,
                    ngayChieuGioChieu,
                    giaVe: priceNum,
                }),
            ).unwrap();
            notifySuccess("Tạo lịch chiếu thành công.");
            setFieldErrors({});
            dispatch(fetchAdminShowtimePhimSchedule(String(maPhimApi)));
        } catch (msg) {
            const message =
                typeof msg === "string" && msg.trim() !== ""
                    ? msg
                    : "Không tạo được lịch chiếu.";
            notifyError(message);
        }
    };

    const onSystemChange = (e) => {
        const v = e.target.value;
        setMaHeThongRap(v);
        setMaCumRap("");
        setFieldErrors({});
    };

    const onClusterChange = (e) => {
        setMaCumRap(e.target.value);
        setFieldErrors({});
    };

    const openNgayChieuPicker = () => {
        const el = ngayChieuInputRef.current;
        if (!el) return;
        if (typeof el.showPicker === "function") {
            try {
                el.showPicker();
                return;
            } catch {
                void 0;
            }
        }
        el.focus();
    };

    const openGioBatDauPicker = () => {
        const el = gioBatDauInputRef.current;
        if (!el) return;
        if (typeof el.showPicker === "function") {
            try {
                el.showPicker();
                return;
            } catch {
                void 0;
            }
        }
        el.focus();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-[#0f172a] dark:shadow-xl dark:shadow-black/25"
        >
            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Thông số lịch chiếu</h2>
                {createState.error ? (
                    <div className="flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-500 dark:bg-red-500/10 dark:text-red-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                            />
                        </svg>
                        <span>{String(createState.error)}</span>
                    </div>
                ) : null}
                {fieldErrors.maPhim ? (
                    <p className={`text-sm ${errTextClass}`}>{fieldErrors.maPhim}</p>
                ) : null}
            </div>

            <div>
                <label htmlFor="showtime-he-thong" className={labelClass}>
                    Hệ thống rạp
                </label>
                <select
                    id="showtime-he-thong"
                    value={maHeThongRap}
                    onChange={onSystemChange}
                    className={inputClass}
                    disabled={showtimeSystemsState.loading}
                >
                    <option value="">— Chọn hệ thống —</option>
                    {systems.map((s) => (
                        <option key={s.maHeThongRap} value={s.maHeThongRap}>
                            {s.tenHeThongRap ?? s.maHeThongRap}
                        </option>
                    ))}
                </select>
                {fieldErrors.maHeThongRap ? (
                    <p className={`mt-1 text-xs ${errTextClass}`}>{fieldErrors.maHeThongRap}</p>
                ) : null}
                {showtimeSystemsState.error ? (
                    <p className={`mt-1 text-xs ${errTextClass}`}>{showtimeSystemsState.error}</p>
                ) : null}
            </div>

            <div>
                <label htmlFor="showtime-cum" className={labelClass}>
                    Chọn rạp (cụm)
                </label>
                <select
                    id="showtime-cum"
                    value={maCumRap}
                    onChange={onClusterChange}
                    className={inputClass}
                    disabled={!maHeThongRap || showtimeClustersState.loading}
                >
                    <option value="">— Chọn cụm —</option>
                    {clusters.map((c) => (
                        <option key={c.maCumRap} value={c.maCumRap}>
                            {c.tenCumRap ?? c.maCumRap}
                        </option>
                    ))}
                </select>
                {fieldErrors.maCumRap ? (
                    <p className={`mt-1 text-xs ${errTextClass}`}>{fieldErrors.maCumRap}</p>
                ) : null}
                {showtimeClustersState.error ? (
                    <p className={`mt-1 text-xs ${errTextClass}`}>{showtimeClustersState.error}</p>
                ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="showtime-ngay" className={labelClass}>
                        Ngày chiếu
                    </label>
                    <div
                        className={`flex items-center overflow-hidden rounded-md border bg-white dark:bg-zinc-950/80 ${
                            fieldErrors.ngayChieu
                                ? "border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/40"
                                : "border-zinc-300 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 dark:border-zinc-600/80"
                        }`}
                    >
                        <input
                            ref={ngayChieuInputRef}
                            id="showtime-ngay"
                            type="date"
                            value={ngayChieu}
                            onChange={(e) => onNgayChieuChange(e.target.value)}
                            className="w-full appearance-none border-none bg-transparent px-3 py-2.5 text-sm text-zinc-900 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0 focus:border-none focus:outline-none focus:ring-0 focus:shadow-none focus-visible:ring-0 focus-visible:shadow-none dark:text-zinc-100 dark:[color-scheme:dark]"
                        />
                        <button
                            type="button"
                            onClick={openNgayChieuPicker}
                            className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center border-l border-zinc-300 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-600/80 dark:text-zinc-100 dark:hover:bg-zinc-800/60 dark:hover:text-white"
                            aria-label="Mở chọn ngày chiếu"
                        >
                            <CalendarMonth className="h-4 w-4" aria-hidden />
                        </button>
                    </div>
                    {fieldErrors.ngayChieu ? (
                        <p className={`mt-1 text-xs ${errTextClass}`}>{fieldErrors.ngayChieu}</p>
                    ) : null}
                </div>
                <div>
                    <label htmlFor="showtime-gio" className={labelClass}>
                        Giờ bắt đầu
                    </label>
                    <div
                        className={`flex items-center overflow-hidden rounded-md border bg-white dark:bg-zinc-950/80 ${
                            fieldErrors.gioBatDau
                                ? "border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/40"
                                : "border-zinc-300 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 dark:border-zinc-600/80"
                        }`}
                    >
                        <input
                            ref={gioBatDauInputRef}
                            id="showtime-gio"
                            type="time"
                            value={gioBatDau}
                            onChange={(e) => setGioBatDau(e.target.value)}
                            className="w-full appearance-none border-none bg-transparent px-3 py-2.5 text-sm text-zinc-900 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0 focus:border-none focus:outline-none focus:ring-0 focus:shadow-none focus-visible:ring-0 focus-visible:shadow-none dark:text-zinc-100 dark:[color-scheme:dark]"
                        />
                        <button
                            type="button"
                            onClick={openGioBatDauPicker}
                            className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center border-l border-zinc-300 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-600/80 dark:text-zinc-100 dark:hover:bg-zinc-800/60 dark:hover:text-white"
                            aria-label="Mở chọn giờ bắt đầu"
                        >
                            <Clock className="h-4 w-4" aria-hidden />
                        </button>
                    </div>
                    {fieldErrors.gioBatDau ? (
                        <p className={`mt-1 text-xs ${errTextClass}`}>{fieldErrors.gioBatDau}</p>
                    ) : null}
                </div>
            </div>

            <div>
                <label htmlFor="showtime-gia" className={labelClass}>
                    Giá vé (VND)
                </label>
                <div className="relative">
                    <input
                        id="showtime-gia"
                        type="text"
                        inputMode="numeric"
                        value={giaVe}
                        onChange={(e) => setGiaVe(e.target.value)}
                        className={`${inputClass} pe-14`}
                        placeholder="120000"
                    />
                    <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-xs font-medium text-zinc-500 dark:text-zinc-500">
                        VND
                    </span>
                </div>
                {fieldErrors.giaVe ? (
                    <p className={`mt-1 text-xs ${errTextClass}`}>{fieldErrors.giaVe}</p>
                ) : null}
            </div>

            <button
                type="submit"
                disabled={createState.loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-rose-300/50 transition hover:from-rose-400 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-rose-900/30"
            >
                <CalendarMonth className="h-5 w-5 shrink-0" aria-hidden />
                {createState.loading ? "Đang tạo…" : "Tạo lịch chiếu"}
            </button>
        </form>
    );
}

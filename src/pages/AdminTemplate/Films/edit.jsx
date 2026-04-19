import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "flowbite-react-icons/outline";
import { closeDialog, openLoading } from "@shared/lib/swal";
import { notifyError, notifySuccess } from "@/shared/lib/toast";
import ErrorBox from "../_components/ErrorBox";
import FilmForm from "./_components/FilmForm";
import {
    fetchDetail,
    filmsSelectors,
    resetDetail,
    resetUpdate,
    updateFilm,
} from "./slice";
import { formatDateInput } from "@utils/dateUtils";
import { clampNumber } from "@utils/numberUtils";

function filmToForm(phim) {
    return {
        tenPhim: phim.tenPhim ?? "",
        trailer: phim.trailer ?? "",
        moTa: phim.moTa ?? "",
        ngayKhoiChieu: formatDateInput(phim.ngayKhoiChieu),
        sapChieu: !!phim.sapChieu,
        dangChieu: !!phim.dangChieu,
        hot: !!phim.hot,
        danhGia: clampNumber(phim.danhGia ?? 5, 1, 10),
    };
}

export default function EditFilm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { idFilm } = useParams();

    const { data, error } = useSelector(filmsSelectors.detail);
    const { loading: updateLoading, error: updateError } =
        useSelector(filmsSelectors.update);

    useEffect(() => {
        return () => {
            dispatch(resetDetail());
            dispatch(resetUpdate());
        };
    }, [dispatch]);

    useEffect(() => {
        if (!idFilm) return;
        dispatch(fetchDetail(idFilm));
    }, [idFilm, dispatch]);

    useEffect(() => {
        if (updateLoading !== true) {
            return undefined;
        }
        openLoading({
            title: "Đang cập nhật phim…",
            text: "Vui lòng đợi trong giây lát.",
        });
        return () => {
            closeDialog();
        };
    }, [updateLoading]);

    const handleRetryLoad = () => {
        if (!idFilm) return;
        dispatch(fetchDetail(idFilm));
    };

    if (!idFilm) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <ErrorBox
                    title="Phim không hợp lệ"
                    message="Thiếu mã phim trong URL."
                    backHref="/admin/films"
                    backLabel="Danh sách phim"
                />
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <ErrorBox
                    title="Không thể tải phim"
                    message={error}
                    onRetry={handleRetryLoad}
                    backHref="/admin/films"
                    backLabel="Danh sách phim"
                />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-8 animate-pulse">
                    <div className="h-4 w-48 rounded bg-zinc-300 dark:bg-zinc-700" />
                    <div className="mt-4 h-10 w-64 max-w-full rounded bg-zinc-300 dark:bg-zinc-700" />
                    <div className="mt-3 h-1 w-20 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-4">
                        <div className="h-[420px] rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="h-full rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80" />
                        </div>
                    </div>
                    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 xl:col-span-8">
                        <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
                            <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
                        </div>
                        <div className="h-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Quản trị &gt; Quản lý phim</p>
                <div className="mt-2 flex items-start justify-between gap-4">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                        Sửa phim
                    </h1>
                    <Link
                        to="/admin/films"
                        className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-800 transition hover:border-rose-500 hover:text-rose-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-white"
                    >
                        <ChevronLeft className="mr-1 h-3.5 w-3.5" aria-hidden />
                        Danh sách phim
                    </Link>
                </div>
                <div className="mt-3 h-1 w-20 rounded-full bg-rose-500" />
            </div>

            <FilmForm
                key={data.maPhim}
                mode="edit"
                film={data}
                initialValues={filmToForm(data)}
                loading={updateLoading === true}
                error={updateError}
                submitText="Cập nhật"
                onSubmit={async (requestFormData) => {
                    try {
                        await dispatch(updateFilm(requestFormData)).unwrap();
                        notifySuccess("Cập nhật phim thành công.");
                        navigate("/admin/films");
                    } catch (rejected) {
                        const message =
                            typeof rejected === "string" && rejected.trim() !== ""
                                ? rejected
                                : "Không thể cập nhật phim. Vui lòng thử lại.";
                        notifyError(message);
                    }
                }}
            />
        </div>
    );
}

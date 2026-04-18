import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "flowbite-react-icons/outline";
import { closeDialog, openLoading } from "@shared/lib/swal";
import { notifySuccess } from "@/shared/lib/toast";
import ErrorBox from "../_components/ErrorBox";
import FilmForm from "./_components/FilmForm";
import {
    fetchFilm,
    resetEditFilmDetailState,
} from "./detailSlice";
import { resetEditFilm, updateFilm } from "./editSlice";

function ngayKhoiChieuFromApiToPickerString(raw) {
    if (raw == null || raw === "") return "";
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

function clampDanhGia(value) {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return 1;
    if (parsed < 1) return 1;
    if (parsed > 10) return 10;
    return parsed;
}

function phimToAdminFilmFormDraft(phim) {
    return {
        tenPhim: phim.tenPhim ?? "",
        trailer: phim.trailer ?? "",
        moTa: phim.moTa ?? "",
        ngayKhoiChieu: ngayKhoiChieuFromApiToPickerString(phim.ngayKhoiChieu),
        sapChieu: Boolean(phim.sapChieu),
        dangChieu: Boolean(phim.dangChieu),
        hot: Boolean(phim.hot),
        danhGia: clampDanhGia(phim.danhGia ?? 5),
    };
}

export default function EditFilmPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { idFilm } = useParams();

    const { data, error } = useSelector((state) => state.editFilmDetailReducer);
    const { loading: updateLoading, error: updateError } = useSelector(
        (state) => state.editFilmReducer,
    );

    useEffect(() => {
        return () => {
            dispatch(resetEditFilmDetailState());
            dispatch(resetEditFilm());
        };
    }, [dispatch]);

    useEffect(() => {
        if (!idFilm) return;
        dispatch(fetchFilm(idFilm));
    }, [idFilm, dispatch]);

    useEffect(() => {
        if (updateLoading !== true) {
            return undefined;
        }
        openLoading({
            title: "Updating film...",
            text: "Please wait a moment.",
        });
        return () => {
            closeDialog();
        };
    }, [updateLoading]);

    const handleRetryLoad = () => {
        if (!idFilm) return;
        dispatch(fetchFilm(idFilm));
    };

    if (!idFilm) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <ErrorBox
                    title="Invalid film"
                    message="Missing film id in the URL."
                    backHref="/admin/films"
                    backLabel="Back to film list"
                />
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <ErrorBox
                    title="Could not load film"
                    message={error}
                    onRetry={handleRetryLoad}
                    backHref="/admin/films"
                    backLabel="Back to film list"
                />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-8 animate-pulse">
                    <div className="h-4 w-48 rounded bg-zinc-700" />
                    <div className="mt-4 h-10 w-64 max-w-full rounded bg-zinc-700" />
                    <div className="mt-3 h-1 w-20 rounded-full bg-zinc-700" />
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-4">
                        <div className="h-[420px] rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                            <div className="h-full rounded-lg bg-zinc-800/80" />
                        </div>
                    </div>
                    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 xl:col-span-8">
                        <div className="h-10 rounded bg-zinc-800" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-10 rounded bg-zinc-800" />
                            <div className="h-10 rounded bg-zinc-800" />
                        </div>
                        <div className="h-24 rounded bg-zinc-800" />
                        <div className="h-10 rounded bg-zinc-800" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
                <p className="text-sm text-zinc-400">Admin &gt; Film management</p>
                <div className="mt-2 flex items-start justify-between gap-4">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-white">
                        Edit Film
                    </h1>
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

            <FilmForm
                key={data.maPhim}
                mode="edit"
                film={data}
                initialValues={phimToAdminFilmFormDraft(data)}
                loading={updateLoading}
                error={updateError}
                submitText="Update"
                onSubmit={async (requestFormData) => {
                    try {
                        await dispatch(updateFilm(requestFormData)).unwrap();
                        notifySuccess("Film updated successfully.");
                        dispatch(resetEditFilmDetailState());
                        dispatch(resetEditFilm());
                        navigate("/admin/films");
                    } catch {
                        void 0;
                    }
                }}
            />
        </div>
    );
}

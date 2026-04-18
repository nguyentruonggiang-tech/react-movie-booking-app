import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "flowbite-react-icons/outline";
import { closeDialog, openLoading } from "@shared/lib/swal";
import { notifySuccess } from "@/shared/lib/toast";
import FilmForm from "./_components/FilmForm";
import { createFilm, resetCreateFilmState } from "./addSlice";

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

export default function AddFilmPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, data } = useSelector(
        (state) => state.addFilmReducer,
    );

    useEffect(() => {
        return () => {
            dispatch(resetCreateFilmState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (!data) return;
        notifySuccess("Film created successfully.");
        dispatch(resetCreateFilmState());
        navigate("/admin/films");
    }, [data, dispatch, navigate]);

    useEffect(() => {
        if (loading !== true) {
            return undefined;
        }
        openLoading({
            title: "Adding film...",
            text: "Please wait a moment.",
        });
        return () => {
            closeDialog();
        };
    }, [loading]);

    return (
        <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
                <p className="text-sm text-zinc-400">Admin &gt; Film management</p>
                <div className="mt-2 flex items-start justify-between gap-4">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-white">
                        Add Film
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
                key="add"
                mode="add"
                film={null}
                initialValues={initialFormValues}
                loading={loading === true}
                error={error}
                submitText="Add film"
                onSubmit={(requestFormData) => {
                    dispatch(createFilm(requestFormData));
                }}
            />
        </div>
    );
}

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "flowbite-react-icons/outline";
import { closeDialog, openLoading } from "@shared/lib/swal";
import { notifyError, notifySuccess } from "@/shared/lib/toast";
import ErrorBox from "../_components/ErrorBox";
import UserForm from "./_components/UserForm";
import {
    fetchUserForEdit,
    fetchUserRoleTypes,
    resetUpdate,
    resetUserDetail,
    updateUser,
    usersSelectors,
} from "./slice";

function decodeTaiKhoanParam(raw) {
    const trimmed = String(raw ?? "").trim();
    if (!trimmed) {
        return "";
    }
    try {
        return decodeURIComponent(trimmed);
    } catch {
        return trimmed;
    }
}

function userRowToFormValues(user) {
    if (!user || typeof user !== "object") {
        return {
            taiKhoan: "",
            email: "",
            matKhau: "",
            soDt: "",
            hoTen: "",
            maLoaiNguoiDung: "",
        };
    }
    return {
        taiKhoan: String(user.taiKhoan ?? "").trim(),
        email: String(user.email ?? "").trim(),
        matKhau: String(user.matKhau ?? ""),
        soDt: String(user.soDT ?? "").trim(),
        hoTen: String(user.hoTen ?? "").trim(),
        maLoaiNguoiDung: String(user.maLoaiNguoiDung ?? "").trim(),
    };
}

export default function EditUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { taiKhoan: taiKhoanParam } = useParams();

    const taiKhoan = useMemo(
        () => decodeTaiKhoanParam(taiKhoanParam),
        [taiKhoanParam],
    );

    const detail = useSelector(usersSelectors.userDetail);
    const detailLoading = useSelector(usersSelectors.userDetailLoading);
    const detailError = useSelector(usersSelectors.userDetailError);
    const { loading: updateLoading, error: updateError } =
        useSelector(usersSelectors.update);

    const roleTypeOptions = useSelector(usersSelectors.roleTypes);
    const roleTypesLoading = useSelector(usersSelectors.roleTypesLoading);
    const roleTypesError = useSelector(usersSelectors.roleTypesError);

    const initialFormValues = useMemo(() => userRowToFormValues(detail), [detail]);

    useEffect(() => {
        return () => {
            dispatch(resetUserDetail());
            dispatch(resetUpdate());
        };
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchUserRoleTypes());
    }, [dispatch]);

    useEffect(() => {
        if (!taiKhoan) {
            return;
        }
        dispatch(fetchUserForEdit(taiKhoan));
    }, [dispatch, taiKhoan]);

    useEffect(() => {
        if (updateLoading !== true) {
            return undefined;
        }
        openLoading({
            title: "Đang cập nhật người dùng…",
            text: "Vui lòng đợi trong giây lát.",
        });
        return () => {
            closeDialog();
        };
    }, [updateLoading]);

    const handleRetryLoad = () => {
        if (!taiKhoan) {
            return;
        }
        dispatch(fetchUserForEdit(taiKhoan));
    };

    if (!taiKhoan) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <ErrorBox
                    title="Người dùng không hợp lệ"
                    message="Thiếu tên tài khoản trong URL."
                    backHref="/admin/users"
                    backLabel="Danh sách người dùng"
                />
            </div>
        );
    }

    if (detailError && !detail) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <ErrorBox
                    title="Không thể tải người dùng"
                    message={detailError}
                    onRetry={handleRetryLoad}
                    backHref="/admin/users"
                    backLabel="Danh sách người dùng"
                />
            </div>
        );
    }

    if (detailLoading || !detail) {
        return (
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-8 animate-pulse">
                    <div className="h-4 w-56 rounded bg-zinc-300 dark:bg-zinc-700" />
                    <div className="mt-4 h-10 w-72 max-w-full rounded bg-zinc-300 dark:bg-zinc-700" />
                    <div className="mt-3 h-1 w-20 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Quản trị &gt; Quản lý người dùng</p>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                            Sửa người dùng
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
                            Cập nhật thông tin và mật khẩu cho{" "}
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                {detail.taiKhoan}
                            </span>
                            .
                        </p>
                    </div>
                    <Link
                        to="/admin/users"
                        className="inline-flex shrink-0 items-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-800 transition hover:border-rose-500 hover:text-rose-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-white"
                    >
                        <ChevronLeft className="mr-1 h-3.5 w-3.5" aria-hidden />
                        Danh sách người dùng
                    </Link>
                </div>
                <div className="mt-3 h-1 w-20 rounded-full bg-rose-500" />
            </div>

            <UserForm
                key={String(detail.taiKhoan)}
                mode="edit"
                initialValues={initialFormValues}
                loading={updateLoading === true}
                error={updateError}
                loadingLabel="Đang cập nhật…"
                roleTypeOptions={roleTypeOptions}
                roleTypesLoading={roleTypesLoading}
                roleTypesError={roleTypesError}
                onRetryRoleTypes={() => dispatch(fetchUserRoleTypes())}
                submitText="Cập nhật"
                onSubmit={async (payload) => {
                    try {
                        await dispatch(updateUser(payload)).unwrap();
                        notifySuccess("Cập nhật người dùng thành công.");
                        navigate("/admin/users");
                    } catch (rejected) {
                        const message =
                            typeof rejected === "string" && rejected.trim() !== ""
                                ? rejected
                                : "Không thể cập nhật người dùng. Vui lòng thử lại.";
                        notifyError(message);
                    }
                }}
            />
        </div>
    );
}

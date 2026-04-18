import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "flowbite-react-icons/outline";
import { closeDialog, openLoading } from "@shared/lib/swal";
import { notifySuccess } from "@/shared/lib/toast";
import UserForm from "./_components/UserForm";
import {
    createUser,
    fetchUserRoleTypes,
    resetCreate,
    usersSelectors,
} from "./slice";

const initialFormValues = {
    taiKhoan: "",
    email: "",
    matKhau: "",
    soDt: "",
    hoTen: "",
    maLoaiNguoiDung: "",
};

export default function AddUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, data } = useSelector(usersSelectors.create);
    const roleTypeOptions = useSelector(usersSelectors.roleTypes);
    const roleTypesLoading = useSelector(usersSelectors.roleTypesLoading);
    const roleTypesError = useSelector(usersSelectors.roleTypesError);

    useEffect(() => {
        dispatch(fetchUserRoleTypes());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetCreate());
        };
    }, [dispatch]);

    useEffect(() => {
        if (!data) {
            return;
        }
        notifySuccess("User created successfully.");
        navigate("/admin/users");
    }, [data, navigate]);

    useEffect(() => {
        if (loading !== true) {
            return undefined;
        }
        openLoading({
            title: "Creating user…",
            text: "Please wait a moment.",
        });
        return () => {
            closeDialog();
        };
    }, [loading]);

    return (
        <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
                <p className="text-sm text-zinc-400">
                    Admin &gt; User management
                </p>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-white">
                            Add user
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                            Create a new system account. Assign a role and
                            share credentials securely outside this app.
                        </p>
                    </div>
                    <Link
                        to="/admin/users"
                        className="inline-flex shrink-0 items-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-200 transition hover:border-rose-500 hover:text-white"
                    >
                        <ChevronLeft className="mr-1 h-3.5 w-3.5" aria-hidden />
                        Back to user list
                    </Link>
                </div>
                <div className="mt-3 h-1 w-20 rounded-full bg-rose-500" />
            </div>

            <UserForm
                key="add-user"
                initialValues={initialFormValues}
                loading={loading === true}
                loadingLabel="Creating…"
                error={error}
                roleTypeOptions={roleTypeOptions}
                roleTypesLoading={roleTypesLoading}
                roleTypesError={roleTypesError}
                onRetryRoleTypes={() => dispatch(fetchUserRoleTypes())}
                submitText="Create user"
                onSubmit={(payload) => {
                    dispatch(createUser(payload));
                }}
            />
        </div>
    );
}

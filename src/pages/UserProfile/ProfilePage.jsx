import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ErrorBox from "@pages/AdminTemplate/_components/ErrorBox";
import { STORAGE_KEY_USER } from "@constants";
import { deleteLocalStorage, getStoredUsername } from "@/utils/storage";
import ProfileDetailsForm from "./_components/ProfileDetailsForm";
import ProfileFormSkeleton from "./_components/ProfileFormSkeleton";
import ProfileMenu from "./_components/ProfileMenu";
import {
    fetchAccountProfile,
    profileSelectors,
    resetProfileState,
} from "./slice";

const shellClassHome =
    "mx-auto w-full max-w-6xl px-4 pb-16 pt-4 text-slate-100 sm:px-6 lg:px-8";
const shellClassAdmin = "mx-auto w-full max-w-6xl text-zinc-100";

export default function ProfilePage({ variant = "home" }) {
    const dispatch = useDispatch();

    const profileData = useSelector(profileSelectors.data);
    const profileLoading = useSelector(profileSelectors.loading);
    const profileError = useSelector(profileSelectors.error);

    useEffect(() => {
        dispatch(fetchAccountProfile(getStoredUsername()));
    }, [dispatch]);

    const loadProfile = useCallback(() => {
        dispatch(fetchAccountProfile(getStoredUsername()));
    }, [dispatch]);

    const handleLogout = useCallback(() => {
        deleteLocalStorage(STORAGE_KEY_USER);
        dispatch(resetProfileState());
        window.location.replace("/login");
    }, [dispatch]);

    const isHome = variant === "home";

    const profileFormRemountKey = profileData
        ? [
              profileData.taiKhoan,
              profileData.email,
              profileData.soDT,
              profileData.hoTen,
              String(profileData.matKhau ?? "").length,
              Array.isArray(profileData.thongTinDatVe)
                  ? profileData.thongTinDatVe.length
                  : "",
          ]
              .map((v) => String(v ?? ""))
              .join("|")
        : "no-profile-data";

    return (
        <div className={isHome ? shellClassHome : shellClassAdmin}>
            <nav
                className={`text-sm ${isHome ? "text-slate-500" : "text-zinc-500"}`}
                aria-label="Breadcrumb"
            >
                {isHome ? (
                    <>
                        <Link
                            to="/"
                            className="transition hover:text-rose-400"
                        >
                            Home
                        </Link>
                        <span className="mx-2 text-slate-600" aria-hidden>
                            &gt;
                        </span>
                    </>
                ) : (
                    <>
                        <Link
                            to="/admin"
                            className="transition hover:text-rose-400"
                        >
                            Admin
                        </Link>
                        <span className="mx-2 text-zinc-600" aria-hidden>
                            &gt;
                        </span>
                    </>
                )}
                <span
                    className={isHome ? "text-slate-300" : "text-zinc-300"}
                    aria-current="page"
                >
                    My account
                </span>
            </nav>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
                User profile
            </h1>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
                <aside className="w-full shrink-0 lg:w-64">
                    <ProfileMenu onLogout={handleLogout} />
                </aside>

                <div className="min-w-0 flex-1 space-y-8">
                    {profileError ? (
                        <ErrorBox
                            title="Could not load profile"
                            message={profileError}
                            onRetry={loadProfile}
                            backHref={isHome ? "/" : "/admin"}
                            backLabel={isHome ? "Back to home" : "Back to admin"}
                        />
                    ) : null}

                    {!profileError && profileLoading && !profileData ? (
                        <ProfileFormSkeleton />
                    ) : null}

                    {!profileError && !profileLoading && profileData ? (
                        <ProfileDetailsForm
                            key={profileFormRemountKey}
                            profile={profileData}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

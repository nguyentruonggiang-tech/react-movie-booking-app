import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ErrorBox from "@pages/AdminTemplate/_components/ErrorBox";
import { STORAGE_KEY_USER } from "@constants";
import { deleteLocalStorage, getStoredUsername } from "@/utils/storage";
import ProfileBookingHistory from "./_components/ProfileBookingHistory";
import ProfileDetailsForm from "./_components/ProfileDetailsForm";
import ProfileFormSkeleton from "./_components/ProfileFormSkeleton";
import ProfileMenu, {
    PROFILE_TAB_BOOKING,
    PROFILE_TAB_PERSONAL,
} from "./_components/ProfileMenu";
import {
    fetchAccountProfile,
    profileSelectors,
    resetProfileState,
} from "./slice";

const shellClassHome =
    "mx-auto w-full max-w-6xl px-4 pb-16 pt-4 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8";
const shellClassAdmin =
    "mx-auto w-full max-w-6xl text-zinc-900 dark:text-zinc-100";

export default function ProfilePage({ variant = "home" }) {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(PROFILE_TAB_PERSONAL);

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

    const profileFormKey = profileData
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
        : "empty";

    return (
        <div className={isHome ? shellClassHome : shellClassAdmin}>
            <nav
                className={`text-sm ${isHome ? "text-slate-600 dark:text-slate-500" : "text-zinc-600 dark:text-zinc-500"}`}
                aria-label="Breadcrumb"
            >
                {isHome ? (
                    <>
                        <Link
                            to="/"
                            className="transition hover:text-rose-600 dark:hover:text-rose-400"
                        >
                            Trang chủ
                        </Link>
                        <span className="mx-2 text-slate-600" aria-hidden>
                            &gt;
                        </span>
                    </>
                ) : (
                    <>
                        <Link
                            to="/admin"
                            className="transition hover:text-rose-600 dark:hover:text-rose-400"
                        >
                            Quản trị
                        </Link>
                        <span className="mx-2 text-zinc-500 dark:text-zinc-600" aria-hidden>
                            &gt;
                        </span>
                    </>
                )}
                <span
                    className={
                        isHome
                            ? "text-slate-700 dark:text-slate-300"
                            : "text-zinc-800 dark:text-zinc-300"
                    }
                    aria-current="page"
                >
                    Tài khoản của tôi
                </span>
            </nav>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Hồ sơ người dùng
            </h1>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
                <aside className="w-full shrink-0 lg:w-64">
                    <ProfileMenu
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                        onLogout={handleLogout}
                    />
                </aside>

                <div className="min-w-0 flex-1 space-y-8">
                    {profileError ? (
                        <ErrorBox
                            title="Không thể tải hồ sơ"
                            message={profileError}
                            onRetry={loadProfile}
                            backHref={isHome ? "/" : "/admin"}
                            backLabel={isHome ? "Trang chủ" : "Trang quản trị"}
                        />
                    ) : null}

                    {!profileError &&
                    activeTab === PROFILE_TAB_PERSONAL &&
                    profileLoading &&
                    !profileData ? (
                        <ProfileFormSkeleton />
                    ) : null}

                    {!profileError &&
                    activeTab === PROFILE_TAB_PERSONAL &&
                    !profileLoading &&
                    profileData ? (
                        <ProfileDetailsForm
                            key={profileFormKey}
                            profile={profileData}
                        />
                    ) : null}

                    {!profileError &&
                    activeTab === PROFILE_TAB_BOOKING &&
                    !profileLoading &&
                    profileData ? (
                        <ProfileBookingHistory
                            tickets={profileData.thongTinDatVe}
                        />
                    ) : null}

                    {!profileError &&
                    activeTab === PROFILE_TAB_BOOKING &&
                    profileLoading &&
                    !profileData ? (
                        <ProfileFormSkeleton />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

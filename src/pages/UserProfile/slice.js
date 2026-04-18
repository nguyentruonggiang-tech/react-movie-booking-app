import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MA_NHOM, USER_ROLE_CUSTOMER } from "@constants";
import api from "@services/api";

const PROFILE_READ_PATH = "QuanLyNguoiDung/ThongTinTaiKhoan";
const PROFILE_WRITE_PATH = "QuanLyNguoiDung/CapNhatThongTinNguoiDung";

const parseRequestError = (error, fallbackMessage) =>
    error?.response?.data?.content ||
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage;

const initialState = {
    data: null,
    loading: false,
    error: null,
    update: {
        loading: false,
        error: null,
    },
};

export const fetchAccountProfile = createAsyncThunk(
    "profile/fetchAccountProfile",
    async (username, { rejectWithValue }) => {
        const taiKhoan = String(username ?? "").trim();
        if (!taiKhoan) {
            return rejectWithValue("Missing signed-in username.");
        }
        try {
            const { data } = await api.post(PROFILE_READ_PATH, { taiKhoan });
            return data?.content ?? null;
        } catch (error) {
            return rejectWithValue(
                parseRequestError(error, "Could not load profile."),
            );
        }
    },
);

export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (accountForm, { rejectWithValue }) => {
        const taiKhoan = String(accountForm?.taiKhoan ?? "").trim();
        if (!taiKhoan) {
            return rejectWithValue("Missing username.");
        }
        try {
            const maNhom = (MA_NHOM && String(MA_NHOM).trim()) || "GP01";
            const body = {
                taiKhoan,
                email: String(accountForm.email ?? "").trim(),
                soDT: String(accountForm.soDT ?? "").trim(),
                maNhom,
                maLoaiNguoiDung: String(
                    accountForm.maLoaiNguoiDung ?? USER_ROLE_CUSTOMER,
                ).trim(),
                hoTen: String(accountForm.hoTen ?? "").trim(),
                matKhau: String(accountForm?.matKhau ?? "").trim(),
            };

            const { data } = await api.put(PROFILE_WRITE_PATH, body);
            return data?.content ?? body;
        } catch (error) {
            return rejectWithValue(
                parseRequestError(error, "Could not update profile."),
            );
        }
    },
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        resetProfileState: () => ({ ...initialState }),
        resetProfileUpdate: (state) => {
            state.update = { loading: false, error: null };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccountProfile.pending, (state) => {
                state.error = null;
                if (state.data == null) {
                    state.loading = true;
                }
            })
            .addCase(fetchAccountProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchAccountProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    typeof action.payload === "string" &&
                    String(action.payload).trim() !== ""
                        ? action.payload
                        : "Could not load profile.";
                state.data = null;
            })
            .addCase(updateProfile.pending, (state) => {
                state.update.loading = true;
                state.update.error = null;
            })
            .addCase(updateProfile.fulfilled, (state) => {
                state.update.loading = false;
                state.update.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.update.loading = false;
                state.update.error =
                    typeof action.payload === "string" &&
                    String(action.payload).trim() !== ""
                        ? action.payload
                        : "Could not update profile.";
            });
    },
});

export const { resetProfileState, resetProfileUpdate } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;

export const profileSelectors = {
    data: (state) => state.profile.data,
    loading: (state) => state.profile.loading,
    error: (state) => state.profile.error,
    updateLoading: (state) => state.profile.update.loading,
    updateError: (state) => state.profile.update.error,
};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/api";
import { STORAGE_KEY_USER } from "@constants";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";

function getUserInfoFromLocalStorage() {
    const userInfo = getLocalStorage(STORAGE_KEY_USER);
    if (!userInfo) return null;
    try {
        return JSON.parse(userInfo);
    } catch {
        return null;
    }
}

const initialState = {
    data: getUserInfoFromLocalStorage(),
    loading: false,
    error: null,
};

export const actLogin = createAsyncThunk("actLogin", async (user, { rejectWithValue }) => {
    try {
        const LOGIN_ENDPOINT = "QuanLyNguoiDung/DangNhap";
        const payload = {
            taiKhoan: String(user.taiKhoan).trim(),
            matKhau: user.matKhau,
        };

        const { data } = await api.post(LOGIN_ENDPOINT, payload);
        const userInfo = data?.content ?? null;
        if (!userInfo?.accessToken) {
            return rejectWithValue("Sign-in failed. Please try again.");
        }
        setLocalStorage(STORAGE_KEY_USER, userInfo);
        return userInfo;
    } catch (error) {
        const message = error?.response?.data?.content || error?.response?.data?.message;
        return rejectWithValue(message || "Sign-in failed. Please try again.");
    }
});

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(actLogin.pending, (state) => {
                state.loading = true;
                state.data = null;
                state.error = null;
            })
            .addCase(actLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(actLogin.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;

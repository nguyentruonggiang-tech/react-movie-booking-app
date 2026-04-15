import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";
import { MA_NHOM, STORAGE_KEY_USER } from "@constants";
import { deleteLocalStorage, getLocalStorage, setLocalStorage } from "@/utils/storage";

function getUserInfoFromLocalStorage() {
    const userInfo = getLocalStorage(STORAGE_KEY_USER);
    if (!userInfo) return null;
    try {
        return JSON.parse(userInfo);
    } catch {
        return null;
    }
}

const authLoginInitialState = {
    data: getUserInfoFromLocalStorage(),
    loading: false,
    error: null,
};

export const actLogin = createAsyncThunk("authLogin/actLogin", async (user, { rejectWithValue }) => {
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

export const actLogout = createAsyncThunk("authLogin/actLogout", async () => {
    deleteLocalStorage(STORAGE_KEY_USER);
    return null;
});

const authLoginSlice = createSlice({
    name: "authLogin",
    initialState: authLoginInitialState,
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
            })
            .addCase(actLogout.fulfilled, (state) => {
                state.data = null;
                state.loading = false;
                state.error = null;
            });
    },
});

const authRegisterInitialState = {
    data: null,
    loading: false,
    error: null,
};

export const actRegister = createAsyncThunk("authRegister/actRegister", async (user, { rejectWithValue }) => {
    try {
        const REGISTER_ENDPOINT = "QuanLyNguoiDung/DangKy";
        const maNhom = (MA_NHOM && String(MA_NHOM).trim()) || "GP01";
        const payload = {
            taiKhoan: String(user.taiKhoan).trim(),
            matKhau: user.matKhau,
            email: String(user.email).trim(),
            soDt: String(user.soDt).trim(),
            maNhom,
            hoTen: String(user.hoTen).trim(),
        };

        const { data } = await api.post(REGISTER_ENDPOINT, payload);
        return data?.content ?? null;
    } catch (error) {
        const message = error?.response?.data?.content || error?.response?.data?.message;
        return rejectWithValue(message || "Registration failed. Please try again.");
    }
});

const authRegisterSlice = createSlice({
    name: "authRegister",
    initialState: authRegisterInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(actRegister.pending, (state) => {
                state.loading = true;
                state.data = null;
                state.error = null;
            })
            .addCase(actRegister.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(actRegister.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const authLoginReducer = authLoginSlice.reducer;
export const authRegisterReducer = authRegisterSlice.reducer;

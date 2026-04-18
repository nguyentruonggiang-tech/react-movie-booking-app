import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";
import { ADMIN_PAGE_SIZE, MA_NHOM } from "@constants";

const USER_ENDPOINTS = {
    LIST: "QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang",
};

const handleError = (error, defaultMessage) =>
    error?.response?.data?.content ||
    error?.response?.data?.message ||
    error?.message ||
    defaultMessage;

export const fetchUserList = createAsyncThunk(
    "users/fetchList",
    async (params, { rejectWithValue }) => {
        try {
            const payload = {
                maNhom: (MA_NHOM && String(MA_NHOM).trim()) || "GP01",
                soTrang: params?.page ?? 1,
                soPhanTuTrenTrang: params?.pageSize ?? ADMIN_PAGE_SIZE,
            };

            if (params?.tuKhoa?.trim()) {
                payload.tuKhoa = params.tuKhoa.trim();
            }

            const { data } = await api.get(USER_ENDPOINTS.LIST, {
                params: payload,
            });

            const content = data?.content || {};

            return {
                items: content.items || [],
                currentPage: content.currentPage || payload.soTrang,
                totalPages: content.totalPages || 0,
                totalCount: content.totalCount || 0,
                pageSize: payload.soPhanTuTrenTrang,
            };
        } catch (error) {
            return rejectWithValue(
                handleError(error, "Could not load user list."),
            );
        }
    },
);

const initialState = {
    list: {
        items: [],
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            pageSize: ADMIN_PAGE_SIZE,
        },
        loading: false,
        error: null,
    },
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserList.pending, (state) => {
                state.list.loading = true;
                state.list.error = null;
            })
            .addCase(fetchUserList.fulfilled, (state, action) => {
                state.list.loading = false;
                state.list.items = action.payload.items;
                state.list.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalCount: action.payload.totalCount,
                    pageSize: action.payload.pageSize,
                };
            })
            .addCase(fetchUserList.rejected, (state, action) => {
                state.list.loading = false;
                state.list.error = action.payload;
            });
    },
});

export const usersReducer = usersSlice.reducer;

export const usersSelectors = {
    list: (state) => state.users.list.items,
    loading: (state) => state.users.list.loading,
    error: (state) => state.users.list.error,
    pagination: (state) => state.users.list.pagination,
};

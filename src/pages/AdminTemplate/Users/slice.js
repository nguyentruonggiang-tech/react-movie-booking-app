import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";
import { ADMIN_PAGE_SIZE, MA_NHOM } from "@constants";

const USER_ENDPOINTS = {
    LIST: "QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang",
    ROLE_TYPES: "QuanLyNguoiDung/LayDanhSachLoaiNguoiDung",
    CREATE: "QuanLyNguoiDung/ThemNguoiDung",
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

export const fetchUserRoleTypes = createAsyncThunk(
    "users/fetchRoleTypes",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(USER_ENDPOINTS.ROLE_TYPES);
            if (data?.statusCode != null && Number(data.statusCode) !== 200) {
                return rejectWithValue(
                    data?.message || "Could not load user types.",
                );
            }
            const items = data?.content || [];
            return { items };
        } catch (error) {
            return rejectWithValue(
                handleError(error, "Could not load user types."),
            );
        }
    },
);

export const createUser = createAsyncThunk(
    "users/create",
    async (payload, { rejectWithValue }) => {
        try {
            const maNhom = (MA_NHOM && String(MA_NHOM).trim()) || "GP01";
            const payload = {
                taiKhoan: String(payload.taiKhoan).trim(),
                matKhau: payload.matKhau,
                email: String(payload.email).trim(),
                soDt: String(payload.soDt).trim(),
                maNhom,
                maLoaiNguoiDung: String(payload.maLoaiNguoiDung).trim(),
                hoTen: String(payload.hoTen).trim(),
            };

            const { data } = await api.post(USER_ENDPOINTS.CREATE, payload);
            return data?.content ?? body;
        } catch (error) {
            return rejectWithValue(
                handleError(error, "Could not create user."),
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

    roleTypes: {
        items: [],
        loading: false,
        error: null,
    },

    create: {
        data: null,
        loading: false,
        error: null,
    },
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        resetCreate: (state) => {
            state.create = { data: null, loading: false, error: null };
        },
    },
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
            })

            .addCase(fetchUserRoleTypes.pending, (state) => {
                state.roleTypes.loading = true;
                state.roleTypes.error = null;
            })
            .addCase(fetchUserRoleTypes.fulfilled, (state, action) => {
                state.roleTypes.loading = false;
                const items = action.payload.items;
                state.roleTypes.items = Array.isArray(items) ? items : [];
            })
            .addCase(fetchUserRoleTypes.rejected, (state, action) => {
                state.roleTypes.loading = false;
                state.roleTypes.error = action.payload;
                state.roleTypes.items = [];
            })

            .addCase(createUser.pending, (state) => {
                state.create.loading = true;
                state.create.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.create.loading = false;
                state.create.data = action.payload;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.create.loading = false;
                state.create.error = action.payload;
            });
    },
});

export const { resetCreate } = usersSlice.actions;

export const usersReducer = usersSlice.reducer;

export const usersSelectors = {
    list: (state) => state.users.list.items,
    loading: (state) => state.users.list.loading,
    error: (state) => state.users.list.error,
    pagination: (state) => state.users.list.pagination,

    roleTypes: (state) => state.users.roleTypes.items,
    roleTypesLoading: (state) => state.users.roleTypes.loading,
    roleTypesError: (state) => state.users.roleTypes.error,

    create: (state) => state.users.create,
};

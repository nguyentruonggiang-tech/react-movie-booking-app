import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";
import { ADMIN_PAGE_SIZE, MA_NHOM } from "@constants";

const USER_ENDPOINTS = {
    LIST: "QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang",
    ROLE_TYPES: "QuanLyNguoiDung/LayDanhSachLoaiNguoiDung",
    DETAIL_BY_USERNAME: "QuanLyNguoiDung/LayThongTinNguoiDung",
    CREATE: "QuanLyNguoiDung/ThemNguoiDung",
    UPDATE: "QuanLyNguoiDung/CapNhatThongTinNguoiDung",
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
            return { items: data?.content };
        } catch (error) {
            return rejectWithValue(
                handleError(error, "Could not load user types."),
            );
        }
    },
);

export const fetchUserForEdit = createAsyncThunk(
    "users/fetchForEdit",
    async (taiKhoanRaw, { rejectWithValue }) => {
        const taiKhoan = String(taiKhoanRaw ?? "").trim();
        if (!taiKhoan) {
            return rejectWithValue("Missing username.");
        }
        try {
            const { data } = await api.request({
                method: "post",
                url: USER_ENDPOINTS.DETAIL_BY_USERNAME,
                params: { taiKhoan },
            });
            const user = data?.content;
            if (!user || typeof user !== "object") {
                return rejectWithValue("User not found.");
            }
            return user;
        } catch (error) {
            return rejectWithValue(
                handleError(error, "Could not load user."),
            );
        }
    },
);

export const createUser = createAsyncThunk(
    "users/create",
    async (formPayload, { rejectWithValue }) => {
        try {
            const maNhom = (MA_NHOM && String(MA_NHOM).trim()) || "GP01";
            const body = {
                taiKhoan: String(formPayload.taiKhoan).trim(),
                matKhau: formPayload.matKhau,
                email: String(formPayload.email).trim(),
                soDt: String(formPayload.soDt).trim(),
                maNhom,
                maLoaiNguoiDung: String(formPayload.maLoaiNguoiDung).trim(),
                hoTen: String(formPayload.hoTen).trim(),
            };

            const { data } = await api.post(USER_ENDPOINTS.CREATE, body);
            return data?.content ?? body;
        } catch (error) {
            return rejectWithValue(
                handleError(error, "Could not create user."),
            );
        }
    },
);

export const updateUser = createAsyncThunk(
    "users/update",
    async (formPayload, { rejectWithValue }) => {
        try {
            const maNhom = (MA_NHOM && String(MA_NHOM).trim()) || "GP01";
            const body = {
                taiKhoan: String(formPayload.taiKhoan).trim(),
                matKhau: formPayload.matKhau,
                email: String(formPayload.email).trim(),
                soDt: String(formPayload.soDt).trim(),
                maNhom,
                maLoaiNguoiDung: String(formPayload.maLoaiNguoiDung).trim(),
                hoTen: String(formPayload.hoTen).trim(),
            };

            try {
                const { data } = await api.post(USER_ENDPOINTS.UPDATE, body);
                return data?.content ?? body;
            } catch (firstError) {
                const status = firstError?.response?.status;
                if (status === 405) {
                    const { data } = await api.post(USER_ENDPOINTS.UPDATE, body);
                    return data?.content ?? body;
                }
                throw firstError;
            }
        } catch (error) {
            return rejectWithValue(
                handleError(error, "Could not update user."),
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

    userDetail: {
        data: null,
        loading: false,
        error: null,
    },

    update: {
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
        resetUserDetail: (state) => {
            state.userDetail = { data: null, loading: false, error: null };
        },
        resetUpdate: (state) => {
            state.update = { data: null, loading: false, error: null };
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
                state.roleTypes.items =
                    items == null ? [] : items;
            })
            .addCase(fetchUserRoleTypes.rejected, (state, action) => {
                state.roleTypes.loading = false;
                state.roleTypes.error = action.payload;
                state.roleTypes.items = [];
            })

            .addCase(fetchUserForEdit.pending, (state) => {
                state.userDetail.loading = true;
                state.userDetail.error = null;
            })
            .addCase(fetchUserForEdit.fulfilled, (state, action) => {
                state.userDetail.loading = false;
                state.userDetail.data = action.payload;
            })
            .addCase(fetchUserForEdit.rejected, (state, action) => {
                state.userDetail.loading = false;
                state.userDetail.error = action.payload;
                state.userDetail.data = null;
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
            })

            .addCase(updateUser.pending, (state) => {
                state.update.loading = true;
                state.update.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.update.loading = false;
                state.update.data = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.update.loading = false;
                state.update.error = action.payload;
            });
    },
});

export const { resetCreate, resetUserDetail, resetUpdate } =
    usersSlice.actions;

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

    userDetail: (state) => state.users.userDetail.data,
    userDetailLoading: (state) => state.users.userDetail.loading,
    userDetailError: (state) => state.users.userDetail.error,

    update: (state) => state.users.update,
};

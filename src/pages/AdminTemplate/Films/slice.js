import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";
import { ADMIN_PAGE_SIZE, MA_NHOM } from "@constants";

// ================= ENDPOINTS =================
const FILM_ENDPOINTS = {
    LIST: "QuanLyPhim/LayDanhSachPhimPhanTrang",
    DELETE: "QuanLyPhim/XoaPhim",
    CREATE: "QuanLyPhim/ThemPhimUploadHinh",
    UPDATE: "QuanLyPhim/CapNhatPhimUpload",
    DETAIL: "QuanLyPhim/LayThongTinPhim",
};

// ================= COMMON =================
const handleError = (error, defaultMessage) =>
    error?.response?.data?.content ||
    error?.response?.data?.message ||
    error?.message ||
    defaultMessage;

// ================= THUNKS =================
export const fetchList = createAsyncThunk(
    "films/fetchList",
    async (params, { rejectWithValue }) => {
        try {
            const payload = {
                maNhom: MA_NHOM,
                soTrang: params?.page ?? 1,
                soPhanTuTrenTrang: params?.pageSize ?? ADMIN_PAGE_SIZE,
            };

            if (params?.tenPhim?.trim()) {
                payload.tenPhim = params.tenPhim.trim();
            }

            const { data } = await api.get(FILM_ENDPOINTS.LIST, {
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
            return rejectWithValue(handleError(error, "Fetch films failed"));
        }
    }
);

export const deleteFilm = createAsyncThunk(
    "films/delete",
    async (maPhim, { rejectWithValue }) => {
        const id = Number(maPhim);
        if (!id) return rejectWithValue("Invalid film id");

        try {
            await api.delete(FILM_ENDPOINTS.DELETE, {
                params: { MaPhim: id },
            });
            return id;
        } catch (error) {
            return rejectWithValue(handleError(error, "Delete failed"));
        }
    }
);

export const createFilm = createAsyncThunk(
    "films/create",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                FILM_ENDPOINTS.CREATE,
                formData
            );
            return data?.content;
        } catch (error) {
            return rejectWithValue(handleError(error, "Create failed"));
        }
    }
);

export const updateFilm = createAsyncThunk(
    "films/update",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                FILM_ENDPOINTS.UPDATE,
                formData
            );
            return data?.content;
        } catch (error) {
            return rejectWithValue(handleError(error, "Update failed"));
        }
    }
);

export const fetchDetail = createAsyncThunk(
    "films/fetchDetail",
    async (maPhim, { rejectWithValue }) => {
        try {
            const { data } = await api.get(FILM_ENDPOINTS.DETAIL, { 
                params: { maPhim },
            });
            return data?.content;
        } catch (error) {
            return rejectWithValue(handleError(error, "Fetch detail failed"));
        }
    }
);

// ================= INITIAL STATE =================
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

    create: {
        data: null,
        loading: false,
        error: null,
    },

    update: {
        data: null,
        loading: false,
        error: null,
    },

    detail: {
        data: null,
        loading: false,
        error: null,
    },
};

// ================= SLICE =================
const filmsSlice = createSlice({
    name: "films",
    initialState,
    reducers: {
        resetCreate: (state) => {
            state.create = { data: null, loading: false, error: null };
        },
        resetUpdate: (state) => {
            state.update = { data: null, loading: false, error: null };
        },
        resetDetail: (state) => {
            state.detail = { data: null, loading: false, error: null };
        },
    },
    extraReducers: (builder) => {
        builder
            // ===== FETCH LIST =====
            .addCase(fetchList.pending, (state) => {
                state.list.loading = true;
                state.list.error = null;
            })
            .addCase(fetchList.fulfilled, (state, action) => {
                state.list.loading = false;
                state.list.items = action.payload.items;
                state.list.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalCount: action.payload.totalCount,
                    pageSize: action.payload.pageSize,
                };
            })
            .addCase(fetchList.rejected, (state, action) => {
                state.list.loading = false;
                state.list.error = action.payload;
            })

            // ===== DELETE =====
            .addCase(deleteFilm.fulfilled, (state, action) => {
                state.list.items = state.list.items.filter(
                    (film) => film.maPhim !== action.payload
                );
            })

            // ===== CREATE =====
            .addCase(createFilm.pending, (state) => {
                state.create.loading = true;
                state.create.error = null;
            })
            .addCase(createFilm.fulfilled, (state, action) => {
                state.create.loading = false;
                state.create.data = action.payload;
            })
            .addCase(createFilm.rejected, (state, action) => {
                state.create.loading = false;
                state.create.error = action.payload;
            })

            // ===== UPDATE =====
            .addCase(updateFilm.pending, (state) => {
                state.update.loading = true;
                state.update.error = null;
            })
            .addCase(updateFilm.fulfilled, (state, action) => {
                state.update.loading = false;
                state.update.data = action.payload;

                const index = state.list.items.findIndex(
                    (film) => film.maPhim === action.payload?.maPhim
                );

                if (index !== -1) {
                    state.list.items[index] = action.payload;
                }
            })
            .addCase(updateFilm.rejected, (state, action) => {
                state.update.loading = false;
                state.update.error = action.payload;
            })

            // ===== DETAIL =====
            .addCase(fetchDetail.pending, (state) => {
                state.detail.loading = true;
                state.detail.error = null;
            })
            .addCase(fetchDetail.fulfilled, (state, action) => {
                state.detail.loading = false;
                state.detail.data = action.payload;
            })
            .addCase(fetchDetail.rejected, (state, action) => {
                state.detail.loading = false;
                state.detail.error = action.payload;
            });
    },
});

export const {
    resetCreate,
    resetUpdate,
    resetDetail,
} = filmsSlice.actions;

export const filmsReducer = filmsSlice.reducer;

// ================= SELECTORS =================
export const filmsSelectors = {
    list: (state) => state.films.list.items,
    loading: (state) => state.films.list.loading,
    error: (state) => state.films.list.error,
    pagination: (state) => state.films.list.pagination,

    create: (state) => state.films.create,
    update: (state) => state.films.update,
    detail: (state) => state.films.detail,
};
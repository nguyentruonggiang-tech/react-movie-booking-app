import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";
import { ADMIN_PAGE_SIZE, MA_NHOM } from "@constants";

const initialState = {
    data: {
        items: [],
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
    },
    loading: false,
    error: null,
};

export const fetchFilmList = createAsyncThunk(
    "adminFilms/fetchFilmList",
    async (params, { rejectWithValue }) => {
        const LIST_PHIM_ENDPOINT = "QuanLyPhim/LayDanhSachPhimPhanTrang";
        const page = params?.page ?? 1;
        const pageSize = params?.pageSize ?? ADMIN_PAGE_SIZE;
        const payload = {
            maNhom: MA_NHOM,
            soTrang: page,
            soPhanTuTrenTrang: pageSize,
        };
        const tenPhim = params?.tenPhim != null ? String(params.tenPhim).trim() : "";
        if (tenPhim !== "") {
            payload.tenPhim = tenPhim;
        }
        try {
            const { data } = await api.get(LIST_PHIM_ENDPOINT, { params: payload });
            const content = data?.content;
            return {
                items: Array.isArray(content?.items) ? content.items : [],
                currentPage: Number(content?.currentPage) || page,
                totalPages: Number(content?.totalPages) || 0,
                totalCount: Number(content?.totalCount) || 0,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ?? error.message ?? "Could not load films.",
            );
        }
    },
);

const fetchFilmsSlice = createSlice({
    name: "fetchFilms",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilmList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilmList.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchFilmList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load films";
            });
    },
});

export const fetchFilmsReducer = fetchFilmsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/api";
import { MA_NHOM } from "@constants";

const initialState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchMovieList = createAsyncThunk(
    "homeMovie/fetchMovieList",
    async (_, { rejectWithValue }) => {
        try {
            const maNhom = MA_NHOM ?? "GP01";
            const params = new URLSearchParams({ maNhom: String(maNhom) });
            const { data } = await api.get(
                `QuanLyPhim/LayDanhSachPhim?${params.toString()}`,
            );
            return data.content ?? [];
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Không tải được danh sách phim.";
            return rejectWithValue(message);
        }
    },
);

const movieSlice = createSlice({
    name: "movieSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovieList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovieList.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchMovieList.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ??
                    action.error?.message ??
                    "Không tải được danh sách phim.";
            });
    },
});

export default movieSlice.reducer;

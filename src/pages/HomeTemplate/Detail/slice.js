import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";

const initialState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchMovieDetail = createAsyncThunk(
    "movieDetail/fetchMovieDetail",
    async (maPhim, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                `QuanLyPhim/LayThongTinPhim?maPhim=${maPhim}`,
            );

            return data.content ?? [];
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Could not load movie detail.";
            return rejectWithValue(message);
        }
    },
);

const movieDetailSlice = createSlice({
    name: "movieDetail",
    initialState,
    reducers: {
        clearMovieDetail: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovieDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = null;
            })
            .addCase(fetchMovieDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchMovieDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = null;
            });
    },
});

export const { clearMovieDetail } = movieDetailSlice.actions;
export default movieDetailSlice.reducer;
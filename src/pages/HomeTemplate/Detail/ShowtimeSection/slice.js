import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";

const initialState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchMovieShowtimes = createAsyncThunk(
    "movieShowtimes/fetchMovieShowtimes",
    async (maPhim, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                `QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`,
            );

            return data.content;
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Could not load showtimes.";
            return rejectWithValue(message);
        }
    },
);

const movieShowtimesSlice = createSlice({
    name: "movieShowtimes",
    initialState,
    reducers: {
        clearMovieShowtimes: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovieShowtimes.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = [];
            })
            .addCase(fetchMovieShowtimes.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchMovieShowtimes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = [];
            });
    },
});

export const { clearMovieShowtimes } = movieShowtimesSlice.actions;
export default movieShowtimesSlice.reducer;
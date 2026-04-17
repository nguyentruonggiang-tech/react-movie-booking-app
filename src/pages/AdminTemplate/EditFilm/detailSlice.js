import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchFilm = createAsyncThunk(
    "adminFilm/fetchFilm",
    async (maPhim, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                `QuanLyPhim/LayThongTinPhim?maPhim=${maPhim}`,
            );
            return data?.content ?? null;
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Could not load film.";
            return rejectWithValue(message);
        }
    },
);

const fetchFilmSlice = createSlice({
    name: "fetchFilm",
    initialState,
    reducers: {
        resetFetchFilm: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilm.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = null;
            })
            .addCase(fetchFilm.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchFilm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load film.";
                state.data = null;
            });
    },
});

export const fetchFilmReducer = fetchFilmSlice.reducer;
export const { resetFetchFilm } = fetchFilmSlice.actions;

/** Same reducer — key used in `store` + `EditFilm` page. */
export const editFilmDetailReducer = fetchFilmReducer;
export { resetFetchFilm as resetEditFilmDetailState };
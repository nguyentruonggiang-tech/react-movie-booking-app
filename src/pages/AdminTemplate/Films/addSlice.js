import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";

const initialState = {
    data: null,
    loading: null,
    error: null,
};

export const createFilm = createAsyncThunk(
    "adminFilms/addFilm",
    async (formData, { rejectWithValue }) => {
        const CREATE_FILM_ENDPOINT = "QuanLyPhim/ThemPhimUploadHinh";
        try {
            const { data } = await api.post(CREATE_FILM_ENDPOINT, formData);
            return data?.content ?? null;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.content ||
                    error?.response?.data?.message ||
                    "Could not create film.",
            );
        }
    },
);

const addFilmSlice = createSlice({
    name: "addFilm",
    initialState,
    reducers: {
        resetCreateFilmState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createFilm.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = null;
            })
            .addCase(createFilm.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload;
            })
            .addCase(createFilm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create film.";
                state.data = null;
            });
    },
});

export const addFilmReducer = addFilmSlice.reducer;
export const { resetCreateFilmState } = addFilmSlice.actions;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const updateFilm = createAsyncThunk(
    "adminFilm/editFilm",
    async (formData, { rejectWithValue }) => {
        const UPDATE_FILM_ENDPOINT = "QuanLyPhim/CapNhatPhimUpload";
        try {
            const { data } = await api.post(UPDATE_FILM_ENDPOINT, formData);
            return data?.content ?? null;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.content ||
                    error?.response?.data?.message ||
                    "Could not update film.",
            );
        }
    },
);

const editFilmSlice = createSlice({
    name: "editFilm",
    initialState,
    reducers: {
        resetEditFilm: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateFilm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFilm.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload;
            })
            .addCase(updateFilm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update film.";
            });
    },
});

export const editFilmReducer = editFilmSlice.reducer;
export const { resetEditFilm } = editFilmSlice.actions;

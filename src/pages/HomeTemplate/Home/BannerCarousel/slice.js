import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/api";

const initialState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchBannerList = createAsyncThunk(
    "homeBanner/fetchBannerList",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("QuanLyPhim/LayDanhSachBanner");
            return data.content ?? [];
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Không tải được danh sách banner.";
            return rejectWithValue(message);
        }
    },
);

const bannerSlice = createSlice({
    name: "bannerSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBannerList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBannerList.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchBannerList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default bannerSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";
import { MA_NHOM } from "@constants";

const initialState = {
    movie: {
        data: null,
        loading: false,
        error: null,
    },
    systems: { data: [], loading: false, error: null },
    clusters: { data: [], loading: false, error: null },
    create: {
        loading: false,
        error: null,
    },
    schedule: {
        raw: null,
        loading: false,
        error: null,
    },
};

function getCreateShowtimeErrorText(error) {
    const data = error?.response?.data;
    const content = data?.content;
    if (typeof content === "string" && content.trim() !== "") {
        return content.trim();
    }
    return data?.message ?? error?.message ?? "Failed to create showtime.";
}

function normalizeClusterList(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw.lstCumRap)) return raw.lstCumRap;
    return [];
}

export const fetchShowtimeHeThongRap = createAsyncThunk(
    "adminShowtime/fetchShowtimeHeThongRap",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("QuanLyRap/LayThongTinHeThongRap");
            return Array.isArray(data?.content) ? data.content : [];
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Không tải được hệ thống rạp.";
            return rejectWithValue(message);
        }
    },
);

export const fetchShowtimeCumRapTheoHeThong = createAsyncThunk(
    "adminShowtime/fetchShowtimeCumRapTheoHeThong",
    async (maHeThongRap, { rejectWithValue }) => {
        const code = String(maHeThongRap ?? "").trim();
        if (!code) {
            return rejectWithValue("Thiếu mã hệ thống rạp.");
        }
        try {
            const params = new URLSearchParams({
                maHeThongRap: code,
                maNhom: String(MA_NHOM ?? "GP01"),
            });
            const { data } = await api.get(
                `QuanLyRap/LayThongTinCumRapTheoHeThong?${params.toString()}`,
            );
            return normalizeClusterList(data?.content);
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Không tải được cụm rạp.";
            return rejectWithValue(message);
        }
    },
);

export const fetchAdminShowtimePhimSchedule = createAsyncThunk(
    "adminShowtime/fetchAdminShowtimePhimSchedule",
    async (maPhim, { rejectWithValue }) => {
        const id = String(maPhim ?? "").trim();
        if (!id) {
            return rejectWithValue("Thiếu mã phim.");
        }
        try {
            const { data } = await api.get(
                `QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${encodeURIComponent(id)}`,
            );
            return data?.content ?? null;
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Không tải được lịch chiếu phim.";
            return rejectWithValue(message);
        }
    },
);

export const fetchAdminShowtimeMovie = createAsyncThunk(
    "adminShowtime/fetchAdminShowtimeMovie",
    async (maPhim, { rejectWithValue }) => {
        const id = String(maPhim ?? "").trim();
        if (!id) {
            return rejectWithValue("Thiếu mã phim.");
        }
        try {
            const { data } = await api.get(
                `QuanLyPhim/LayThongTinPhim?maPhim=${encodeURIComponent(id)}`,
            );
            return data?.content ?? null;
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Không tải được thông tin phim.";
            return rejectWithValue(message);
        }
    },
);

export const createAdminShowtime = createAsyncThunk(
    "adminShowtime/createAdminShowtime",
    async (payload, { rejectWithValue }) => {
        try {
            const body = {
                maPhim: Number(payload.maPhim),
                // Backend API yêu cầu key là maRap, nhưng thực chất đây là mã cụm rạp (maCumRap) người dùng chọn.
                maRap: payload.maCumRap,
                ngayChieuGioChieu: String(payload.ngayChieuGioChieu ?? "").trim(),
                giaVe: Number(payload.giaVe),
            };
            const { data } = await api.post("QuanLyDatVe/TaoLichChieu", body);
            return data?.content ?? data ?? true;
        } catch (error) {
            return rejectWithValue(getCreateShowtimeErrorText(error));
        }
    },
);

const adminShowtimeSlice = createSlice({
    name: "adminShowtime",
    initialState,
    reducers: {
        resetAdminShowtimePage: () => initialState,
        clearAdminShowtimeCreateError: (state) => {
            state.create.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShowtimeHeThongRap.pending, (state) => {
                state.systems.loading = true;
                state.systems.error = null;
            })
            .addCase(fetchShowtimeHeThongRap.fulfilled, (state, action) => {
                state.systems.loading = false;
                state.systems.data = action.payload;
                state.systems.error = null;
            })
            .addCase(fetchShowtimeHeThongRap.rejected, (state, action) => {
                state.systems.loading = false;
                state.systems.error = action.payload;
                state.systems.data = [];
            })
            .addCase(fetchShowtimeCumRapTheoHeThong.pending, (state) => {
                state.clusters.loading = true;
                state.clusters.error = null;
                state.clusters.data = [];
            })
            .addCase(fetchShowtimeCumRapTheoHeThong.fulfilled, (state, action) => {
                state.clusters.loading = false;
                state.clusters.data = action.payload;
                state.clusters.error = null;
            })
            .addCase(fetchShowtimeCumRapTheoHeThong.rejected, (state, action) => {
                state.clusters.loading = false;
                state.clusters.error = action.payload;
                state.clusters.data = [];
            })
            .addCase(fetchAdminShowtimePhimSchedule.pending, (state) => {
                state.schedule.loading = true;
                state.schedule.error = null;
            })
            .addCase(fetchAdminShowtimePhimSchedule.fulfilled, (state, action) => {
                state.schedule.loading = false;
                state.schedule.raw = action.payload;
                state.schedule.error = null;
            })
            .addCase(fetchAdminShowtimePhimSchedule.rejected, (state, action) => {
                state.schedule.loading = false;
                state.schedule.error = action.payload;
                state.schedule.raw = null;
            })
            .addCase(fetchAdminShowtimeMovie.pending, (state) => {
                state.movie.loading = true;
                state.movie.error = null;
                state.movie.data = null;
                state.schedule.raw = null;
                state.schedule.loading = false;
                state.schedule.error = null;
            })
            .addCase(fetchAdminShowtimeMovie.fulfilled, (state, action) => {
                state.movie.loading = false;
                state.movie.data = action.payload;
                state.movie.error = null;
            })
            .addCase(fetchAdminShowtimeMovie.rejected, (state, action) => {
                state.movie.loading = false;
                state.movie.error = action.payload;
                state.movie.data = null;
                state.schedule.raw = null;
                state.schedule.loading = false;
                state.schedule.error = null;
            })
            .addCase(createAdminShowtime.pending, (state) => {
                state.create.loading = true;
                state.create.error = null;
            })
            .addCase(createAdminShowtime.fulfilled, (state) => {
                state.create.loading = false;
                state.create.error = null;
            })
            .addCase(createAdminShowtime.rejected, (state, action) => {
                state.create.loading = false;
                state.create.error = action.payload;
            });
    },
});

export const { resetAdminShowtimePage, clearAdminShowtimeCreateError } =
    adminShowtimeSlice.actions;

export const adminShowtimeReducer = adminShowtimeSlice.reducer;

export const adminShowtimeSelectors = {
    movie: (state) => state.adminShowtime?.movie ?? initialState.movie,
    systems: (state) => state.adminShowtime?.systems ?? initialState.systems,
    clusters: (state) => state.adminShowtime?.clusters ?? initialState.clusters,
    create: (state) => state.adminShowtime?.create ?? initialState.create,
    schedule: (state) => state.adminShowtime?.schedule ?? initialState.schedule,
};

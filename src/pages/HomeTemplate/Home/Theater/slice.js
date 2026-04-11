import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";
import { MA_NHOM } from "@constants";

const theaterSystemsInitialState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchTheaterSystems = createAsyncThunk(
    "theaterSystems/fetchTheaterSystems",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("QuanLyRap/LayThongTinHeThongRap");
            return res.data.content ?? [];
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Could not load theater systems.";
            return rejectWithValue(message);
        }
    }
);

const theaterSystemsSlice = createSlice({
    name: "theaterSystems",
    initialState: theaterSystemsInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTheaterSystems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTheaterSystems.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchTheaterSystems.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to load theater systems";
            });
    },
});


const theaterClustersInitialState = {
    data: [],
    loading: false,
    error: null,
};


export const fetchTheaterClusters = createAsyncThunk(
    "theaterClusters/fetchTheaterClusters",
    async (maHeThongRap, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `QuanLyRap/LayThongTinCumRapTheoHeThong?maNhom=${MA_NHOM}&maHeThongRap=${maHeThongRap}`
            );

            return res.data.content ?? [];
        } catch (error) {
            const message = 
                error.response?.data?.message ??
                error.message ??
                "Could not load theater clusters.";
            return rejectWithValue(message);
        }
    }
);

const theaterClustersSlice = createSlice({
    name: "theaterClusters",
    initialState: theaterClustersInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTheaterClusters.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = [];
            })
            .addCase(fetchTheaterClusters.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchTheaterClusters.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to load theater clusters";
            });
    },
});

function getClusterList(content) {
    if (!content) return [];

    if (Array.isArray(content)) {
        return content.flatMap((item) => item?.lstCumRap ?? []);
    }

    if (Array.isArray(content?.lstCumRap)) {
        return content.lstCumRap;
    }

    return [];
}

function getMoviesByClusterCode(content, clusterCode) {
    const clusterList = getClusterList(content);

    const cluster = clusterList.find(
        (item) => item?.maCumRap === clusterCode
    );

    return Array.isArray(cluster?.danhSachPhim) ? cluster.danhSachPhim : [];
}

const theaterShowtimesInitialState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchTheaterShowtimes = createAsyncThunk(
    "theaterShowtimes/fetchTheaterShowtimes",
    async (payload, { rejectWithValue }) => {
        const maHeThongRap =
            payload?.theaterSystemCode ?? payload?.maHeThongRap ?? "";
        const maCumRap = payload?.clusterCode ?? payload?.maCumRap ?? "";
        try {
            const params = new URLSearchParams({
                maHeThongRap: String(maHeThongRap),
                maNhom: String(MA_NHOM ?? "GP01"),
            });
            const res = await api.get(
                `QuanLyRap/LayThongTinLichChieuHeThongRap?${params.toString()}`,
            );
            return getMoviesByClusterCode(res.data.content, maCumRap);
        } catch (error) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Could not load theater showtimes.";
            return rejectWithValue(message);
        }
    },
);

const theaterShowtimesSlice = createSlice({
    name: "theaterShowtimes",
    initialState: theaterShowtimesInitialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTheaterShowtimes.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = [];
            })
            .addCase(fetchTheaterShowtimes.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchTheaterShowtimes.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error =
                    action.payload ??
                    action.error?.message ??
                    "Could not load theater showtimes.";
            });
    },
});

export const theaterSystemsReducer = theaterSystemsSlice.reducer;
export const theaterClustersReducer = theaterClustersSlice.reducer;
export const theaterShowtimesReducer = theaterShowtimesSlice.reducer;
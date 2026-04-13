import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@services/api";

const SEATS_PER_ROW = 10;

function getSeatRowInfo(tenGhe) {
    const seatNumber = Number(String(tenGhe ?? "").replace(/\D/g, ""));

    if (!Number.isFinite(seatNumber) || seatNumber <= 0) {
        return {
            row: "1",
            orderInRow: 1,
        };
    }

    const rowNumber = Math.floor((seatNumber - 1) / SEATS_PER_ROW) + 1;
    const orderInRow = ((seatNumber - 1) % SEATS_PER_ROW) + 1;

    return {
        row: String(rowNumber),
        orderInRow,
    };
}

function mapSeatFromApi(apiSeat) {
    const { row } = getSeatRowInfo(apiSeat.tenGhe);

    return {
        maGhe: apiSeat.maGhe,
        row,
        tenGhe: String(apiSeat.tenGhe ?? ""),
        soGhe: `${row}-${apiSeat.tenGhe}`,
        gia: Number(apiSeat.giaVe) || 0,
        daDat: apiSeat.daDat === true,
        daCoNguoiChon: apiSeat.daCoNguoiChon === true,
        dangChon: apiSeat.dangChon === true,
        loaiGhe: apiSeat.loaiGhe || "Thuong",
    };
}

function buildHeaderRow() {
    return {
        row: "",
        danhSachGhe: Array.from({ length: SEATS_PER_ROW }, (_, index) => ({
            soGhe: String(index + 1),
            gia: 0,
            daDat: false,
        })),
    };
}

function buildSeatRows(danhSachGhe) {
    if (!Array.isArray(danhSachGhe) || danhSachGhe.length === 0) {
        return [];
    }

    const grouped = danhSachGhe.reduce((result, apiSeat) => {
        const mappedSeat = mapSeatFromApi(apiSeat);
        const rowKey = mappedSeat.row;

        if (!result[rowKey]) {
            result[rowKey] = [];
        }

        result[rowKey].push(mappedSeat);
        return result;
    }, {});

    const bodyRows = Object.keys(grouped)
        .sort((a, b) => Number(a) - Number(b))
        .map((rowKey) => ({
            row: rowKey,
            danhSachGhe: grouped[rowKey].sort((a, b) => {
                const left = Number(a.tenGhe) || 0;
                const right = Number(b.tenGhe) || 0;
                return left - right;
            }),
        }));

    return [buildHeaderRow(), ...bodyRows];
}

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchTicketRoom = createAsyncThunk(
    "ticketRoom/fetchTicketRoom",
    async (maLichChieu, { rejectWithValue }) => {
        const showtimeId = String(maLichChieu ?? "").trim();

        if (!showtimeId) {
            return rejectWithValue("Missing showtime id in URL.");
        }

        try {
            const response = await api.get(
                `QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${encodeURIComponent(showtimeId)}`,
            );

            const content = response?.data?.content;

            if (!content?.thongTinPhim || !Array.isArray(content?.danhSachGhe)) {
                return rejectWithValue(
                    response?.data?.message || "Seat map response was empty.",
                );
            }

            return {
                thongTinPhim: content.thongTinPhim,
                seatRows: buildSeatRows(content.danhSachGhe),
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Could not load ticket room.",
            );
        }
    },
);

const ticketRoomSlice = createSlice({
    name: "ticketRoomSlice",
    initialState,
    reducers: {
        clearTicketRoom: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTicketRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = null;
            })
            .addCase(fetchTicketRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchTicketRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = null;
            });
    },
});

export const { clearTicketRoom } = ticketRoomSlice.actions;
export default ticketRoomSlice.reducer;
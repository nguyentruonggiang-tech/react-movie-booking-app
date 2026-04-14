import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import api from "@services/api";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";
import { STORAGE_KEY_SELECTED_SEATS } from "@/constants";

const SEATS_PER_ROW = 10;

function loadSelectedSeatsFromStorage() {
    try {
        const raw = getLocalStorage(STORAGE_KEY_SELECTED_SEATS);
        if (raw == null || raw === "") {
            return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function toStorableSeat(seat) {
    return {
        maGhe: seat.maGhe,
        row: seat.row,
        tenGhe: seat.tenGhe,
        soGhe: seat.soGhe,
        gia: Number(seat.gia) || 0,
        loaiGhe: seat.loaiGhe,
    };
}

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
    selectedSeats: loadSelectedSeatsFromStorage(),
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
        clearTicketRoom: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.selectedSeats = loadSelectedSeatsFromStorage();
        },
        toggleSeat: (state, action) => {
            const seat = action.payload;
            const seatId = String(seat?.maGhe ?? "");
            if (!seatId) {
                return;
            }

            const existingSelectedIndex = state.selectedSeats.findIndex(
                (selectedSeat) =>
                    String(selectedSeat?.maGhe ?? "") === seatId,
            );

            if (existingSelectedIndex >= 0) {
                state.selectedSeats.splice(existingSelectedIndex, 1);
            } else {
                state.selectedSeats.push(toStorableSeat(seat));
            }

            setLocalStorage(
                STORAGE_KEY_SELECTED_SEATS,
                current(state.selectedSeats),
            );
        },
        removeSeat: (state, action) => {
            const payload = action.payload;
            const isSeatPayload =
                typeof payload === "object" &&
                payload !== null &&
                !Array.isArray(payload);

            const maGheTarget = isSeatPayload
                ? String(payload.maGhe ?? "").trim()
                : String(payload ?? "").trim();
            const soGheTarget = isSeatPayload
                ? String(payload.soGhe ?? "").trim()
                : "";

            if (!maGheTarget && !soGheTarget) {
                return;
            }

            const nextSelectedSeats = state.selectedSeats.filter(
                (selectedSeat) => {
                    const id = String(selectedSeat?.maGhe ?? "").trim();
                    const label = String(selectedSeat?.soGhe ?? "").trim();

                    if (maGheTarget) {
                        return id !== maGheTarget;
                    }
                    return label !== soGheTarget;
                },
            );

            state.selectedSeats = nextSelectedSeats;
            setLocalStorage(
                STORAGE_KEY_SELECTED_SEATS,
                nextSelectedSeats.map((seat) => ({ ...seat })),
            );
        },
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

export const { clearTicketRoom, toggleSeat, removeSeat } =
    ticketRoomSlice.actions;
export default ticketRoomSlice.reducer;
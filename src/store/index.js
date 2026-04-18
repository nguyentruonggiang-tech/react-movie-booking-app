import { configureStore } from "@reduxjs/toolkit";
import bannerReducer from "@pages/HomeTemplate/Home/BannerCarousel/slice";
import movieReducer from "@pages/HomeTemplate/Home/MovieList/slice";
import {
    theaterSystemsReducer,
    theaterClustersReducer,
    theaterShowtimesReducer,
} from "@pages/HomeTemplate/Home/Theater/slice";
import movieDetailReducer from "@pages/HomeTemplate/Detail/MovieDetail/slice";
import movieShowtimesReducer from "@pages/HomeTemplate/Detail/ShowtimeSection/slice";
import ticketRoomReducer from "@pages/HomeTemplate/TicketRoom/slice";
import { authLoginReducer, authRegisterReducer } from "@pages/Auth/slice";
import { fetchFilmsReducer } from "@pages/AdminTemplate/Films/slice";
import { addFilmReducer } from "@pages/AdminTemplate/Films/addSlice";
import { editFilmReducer } from "@pages/AdminTemplate/Films/editSlice";
import { editFilmDetailReducer } from "@pages/AdminTemplate/Films/detailSlice";

const store = configureStore({
    reducer: {
        authLoginReducer,
        authRegisterReducer,
        fetchFilmsReducer,
        addFilmReducer,
        editFilmDetailReducer,
        editFilmReducer,
        bannerReducer,
        movieReducer,
        theaterSystemsReducer,
        theaterClustersReducer,
        theaterShowtimesReducer,
        movieDetailReducer,
        movieShowtimesReducer,
        ticketRoomReducer,
    },
});

export default store;

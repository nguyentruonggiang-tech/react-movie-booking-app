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
import { filmsReducer } from "@pages/AdminTemplate/Films/slice";
import { usersReducer } from "@pages/AdminTemplate/Users/slice";
import { profileReducer } from "@pages/UserProfile/slice";
import { adminShowtimeReducer } from "@pages/AdminTemplate/ShowTime/slice";
import themeReducer from "./themeSlice";

const store = configureStore({
    reducer: {
        theme: themeReducer,
        authLoginReducer,
        authRegisterReducer,
        films: filmsReducer,
        users: usersReducer,
        profile: profileReducer,
        adminShowtime: adminShowtimeReducer,
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

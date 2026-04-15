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
import { authLoginReducer, authRegisterReducer } from "@pages/Auth/slice";

const store = configureStore({
    reducer: {
        authLoginReducer,
        authRegisterReducer,
        bannerReducer,
        movieReducer,
        theaterSystemsReducer,
        theaterClustersReducer,
        theaterShowtimesReducer,
        movieDetailReducer,
        movieShowtimesReducer,
    },
});

export default store;

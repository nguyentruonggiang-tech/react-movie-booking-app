import { configureStore } from "@reduxjs/toolkit";
import bannerReducer from "../pages/HomeTemplate/Home/bannerSlice";
import movieReducer from "../pages/HomeTemplate/Home/movieSlice";
import {theaterSystemsReducer, theaterClustersReducer, theaterShowtimesReducer} from "@pages/HomeTemplate/Home/Theater/slice";

const store = configureStore({
    reducer: {
        bannerReducer,
        movieReducer,
        theaterSystemsReducer,
        theaterClustersReducer,
        theaterShowtimesReducer
    },
});

export default store;

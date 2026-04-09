import { configureStore } from "@reduxjs/toolkit";
import bannerReducer from "../pages/HomeTemplate/Home/bannerSlice";

const store = configureStore({
    reducer: {
        bannerReducer
    },
});

export default store;

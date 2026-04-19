import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEY_THEME } from "@constants";
import { setLocalStorage } from "@utils/storage";
import { normPref, readPref } from "@utils/theme";

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        pref: readPref(),
    },
    reducers: {
        setPref(state, action) {
            const next = normPref(action.payload);
            state.pref = next;
            setLocalStorage(STORAGE_KEY_THEME, next);
        },
    },
});

export const { setPref } = themeSlice.actions;
export default themeSlice.reducer;

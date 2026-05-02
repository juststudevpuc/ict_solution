import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
    name: "token",
    // 1. Start out as null (no object wrapper)
    initialState: null, 
    reducers: {
        // 2. Just return the payload directly! Redux will replace the state with the string.
        setToken: (state, action) => {
            return action.payload; 
        },
        // 3. Clear token back to null
        clearToken: () => null,
    }
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
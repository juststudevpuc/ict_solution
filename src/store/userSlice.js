import { createSlice } from "@reduxjs/toolkit";

// ✅ Start as null so {user ? ...} logic works correctly
const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Replaces null with the user object from Laravel
    setUser: (state, action) => action.payload, 
    
    // ✅ Resets state back to null
    logout: () => null, 
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
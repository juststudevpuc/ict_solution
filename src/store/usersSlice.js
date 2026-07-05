import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null, // ✅ Stores the active logged-in admin profile object
  users: [],         // Keeps your dashboard CRUD array functioning separately
  refresh: true, 
};

const userSlice = createSlice({
  name: "user", // Fixed to singular matching your root reducer key name
  initialState,
  reducers: {
    // ✅ FIXED: Added the missing action your login form executes on response success
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    // ✅ FIXED: Clear user on logout
    logoutUser: (state) => {
      state.currentUser = null;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const { id, data } = action.payload;
      const index = state.users.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...data };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((item) => item.id !== action.payload);
    },
    clearAll: (state) => {
      state.users = [];
    },
    setRefresh: (state, action) => {
      state.refresh = action.payload;
    },
  },
});

// Export all actions cleanly
export const { setUser, logoutUser, addUser, updateUser, deleteUser, clearAll, setRefresh } = userSlice.actions;
export default userSlice.reducer;
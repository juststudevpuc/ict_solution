import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "../store/counterSlice.js";
import userReducer from "../store/userSlice.js";
import cartReducer from "../store/cartSlice.js";
import refreshReducer from "../store/refreshSlice.js";

import persistReducer from "redux-persist/es/persistReducer";
import { persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persitConfig = {
  key : "root",
  storage,
  // ✅ FIXED: Added "user" to the whitelist so the session survives a page refresh
  whitelist : ["counter", "cart", "refresh", "user"] 
};

const rootReducer = combineReducers({
  counter : counterReducer,
  user : userReducer, // Maps to your user state slice
  cart : cartReducer,
  refresh : refreshReducer,
});

const persistedReducer = persistReducer(persitConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // Recommended: Turn off serializable checks for redux-persist actions to prevent console warnings
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persitor = persistStore(store);
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "../store/counterSlice.js";
import userReducer from "../store/userSlice.js";
import cartReducer from "../store/cartSlice.js";
import refreshReducer from "../store/refreshSlice.js";

// Redux Persist imports
import persistReducer from "redux-persist/es/persistReducer";
import { persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persitConfig = {
  key : "root",
  storage,
  // 🔒 IRONCLAD SECURITY: Only these 3 items are allowed in the browser's hard drive.
  // "user" and "token" are strictly forbidden from entering local storage.
  whitelist : ["counter", "cart", "refresh"] 
};

const rootReducer = combineReducers({
  counter : counterReducer,
  user : userReducer,
  cart : cartReducer,
  refresh : refreshReducer,
  // 🧹 Token completely removed!
});

const persistedReducer = persistReducer(persitConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persitor = persistStore(store);
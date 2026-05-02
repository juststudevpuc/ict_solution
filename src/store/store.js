import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "../store/counterSlice.js";
import userReducer from "../store/userSlice.js";
import cartReducer from "../store/cartSlice.js";
import refreshReducer from "../store/refreshSlice.js";
import tokenReducer from "../store/tokenSlice.js";
import persistReducer from "redux-persist/es/persistReducer";
import { persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persitConfig = {
  key : "root",
  storage,
  whitelist : ["user" , "counter", "cart", "refresh", "token"]
};

const rootReducer = combineReducers({
  counter : counterReducer,
  user : userReducer,
  cart : cartReducer,
  refresh : refreshReducer,
  token: tokenReducer,
})

const persistedReducer = persistReducer(persitConfig , rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
});

export const persitor = persistStore(store);
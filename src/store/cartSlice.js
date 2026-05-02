import { createSlice } from "@reduxjs/toolkit";


const initialState = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // add to cart
        addItemCart: (state, action) => {
            const itemIndex = state.findIndex((item) => item.id === action.payload.id);
            if (itemIndex >= 0) {
                // If product exists, just increase quantity
                state[itemIndex].qty += 1;
            } else {
                // If new product, add it with qty 1
                const tempProduct = { ...action.payload, qty: 1 };
                state.push(tempProduct);
            }
        },
        // decremenr from cart
        decrementCart: (state, action) => {
            const item = action.payload;
            const existing = state.find((i) => i.id === item.id);

            if (existing?.qty > 0) {
                existing.qty -= 1;
            } else {
                return state.filter((i) => i.id !== item.id);
            }
        },
        // remove from cart
        clearItemCart: (state, action) => {
            const item = action.payload;
            return state.filter((i) => i.id !== item.id);
        },
        // clear cart all 
        clearAllCart: () => initialState,
    }
});

export const { addItemCart, clearAllCart, decrementCart, clearItemCart } = cartSlice.actions;
export default cartSlice.reducer;

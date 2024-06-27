import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartList, CartItem } from "@/interface/cartInterface";

// Define the initial state
interface CartState {
    items: CartList;
    totalPrice: number;
}

const initialState: CartState = {
    items: [],
    totalPrice: 0,
};

// Create the cart slice
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<CartList>) => {
            return { ...state, items: action.payload };
        },
        setTotalPrice: (state, action: PayloadAction<number>) => {
            state.totalPrice = action.payload;
        },
        addItemToCart: (state, action: PayloadAction<CartItem>) => {
            state.items.push(action.payload);
            state.totalPrice += action.payload.product.price * action.payload.quantity;
        },
        removeItemFromCart: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex(item => item.product._id === action.payload);
            if (index !== -1) {
                state.totalPrice -= state.items[index].product.price * state.items[index].quantity;
                state.items.splice(index, 1);
            }
        },
        updateItemQuantity: (state, action: PayloadAction<{ id: string, quantity: number }>) => {
            const item = state.items.find(item => item.product._id === action.payload.id);
            if (item) {
                state.totalPrice += (action.payload.quantity - item.quantity) * item.product.price;
                item.quantity = action.payload.quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
        }
    },
});

// Export the actions and reducer
export const { setCart, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart, setTotalPrice } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

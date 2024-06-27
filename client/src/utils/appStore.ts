import { configureStore } from "@reduxjs/toolkit";
import { productsReducer } from "./products";
import { userReducer } from "./userStore";
import { cartReducer } from "./cartStore";

const appStore = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer,
    cart: cartReducer
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export default appStore;

import { configureStore } from "@reduxjs/toolkit";
import { productsReducer } from "./products";
import { userReducer } from "./userStore";

const appStore = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export default appStore;

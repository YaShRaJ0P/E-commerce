import { configureStore } from "@reduxjs/toolkit";
import { productsReducer } from "./products";

const appStore = configureStore({
  reducer: {
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export default appStore;

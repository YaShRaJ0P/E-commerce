import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductList } from "@/interface/productInterface";

const initialState: ProductList = [];

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<ProductList>) => {
            return action.payload;
        },
    },
});

export const { setProducts } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;

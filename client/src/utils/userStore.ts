import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state interface
interface UserState {
    username: string;
    userId: string;
}

// Define the payload interface for setUser action
interface UserPayload {
    username: string;
    userId: string;
}

// Initial state
const initialState: UserState = {
    username: "",
    userId: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserPayload>) => {
            return action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;

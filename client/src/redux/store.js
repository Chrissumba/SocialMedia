import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authorizationSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        // Add other reducers if needed
    },
});

export default store;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk for login action
export const login = createAsyncThunk(
    "auth/login",
    async(credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3000/login", credentials, { withCredentials: true });

            const { data } = response
            //  localStorage.setItem('auth', JSON.stringify(token));
            return data;
        } catch (error) {
            console.log("Login Error:", error);
            return rejectWithValue(error.response.data);
        }
    }
);


// Async Thunk for registration action
export const register = createAsyncThunk(
    "auth/register",
    async(userData, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3000/register", userData);
            // Assuming the API returns a success message upon successful registration
            return response.data.message;
        } catch (error) {
            // Handle error and return the error response
            return rejectWithValue(error.response.data);
        }
    }
);

// Auth Slice
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        error: null,
        isLoading: false,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {

                state.isLoading = true;
                state.error = null;
            })
        builder.addCase(login.fulfilled, (state, action) => {
            console.log(action.payload)
            state.isLoading = false;
            state.error = null;
            state.user = action.payload;
        })
        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            // Handle successful registration if needed
        })
        builder.addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
// // updateSlice.js

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { makeRequest } from "../../axios";

// // Async Thunks
// export const uploadImage = createAsyncThunk(
//     "update/uploadImage",
//     async(formData) => {
//         try {
//             const res = await makeRequest.post("/upload", formData);
//             return res.data;
//         } catch (err) {
//             throw err;
//         }
//     }
// );

// export const updateUser = createAsyncThunk(
//     "update/updateUser",
//     async(user) => {
//         try {
//             const res = await makeRequest.put("/users", user);
//             return res.data;
//         } catch (err) {
//             throw err;
//         }
//     }
// );

// // Slice
// const updateSlice = createSlice({
//     name: "update",
//     initialState: {
//         coverUrl: null,
//         profileUrl: null,
//         isLoading: false,
//         error: null,
//     },
//     reducers: {
//         clearImageUrls: (state) => {
//             state.coverUrl = null;
//             state.profileUrl = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(uploadImage.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(uploadImage.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.coverUrl = action.payload;
//             })
//             .addCase(uploadImage.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.error.message;
//             })
//             .addCase(updateUser.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(updateUser.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.profileUrl = action.payload;
//             })
//             .addCase(updateUser.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.error.message;
//             });
//     },
// });

// export const { clearImageUrls } = updateSlice.actions;

// export default updateSlice.reducer;
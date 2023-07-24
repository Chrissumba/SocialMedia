// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { makeRequest } from "../../axios";

// export const fetchProfile = createAsyncThunk("profile/fetchProfile", async(userId) => {
//     try {
//         const response = await makeRequest.get(`/users/find/${userId}`);
//         return response.data;
//     } catch (error) {
//         throw Error(error.message);
//     }
// });

// export const fetchRelationships = createAsyncThunk("profile/fetchRelationships", async(userId) => {
//     try {
//         const response = await makeRequest.get(`/relationships?followedUserId=${userId}`);
//         return response.data;
//     } catch (error) {
//         throw Error(error.message);
//     }
// });

// export const followUser = createAsyncThunk("profile/followUser", async(payload) => {
//     const { following, userId } = payload;
//     try {
//         if (following) {
//             await makeRequest.delete(`/relationships?userId=${userId}`);
//         } else {
//             await makeRequest.post("/relationships", { userId });
//         }
//         return userId;
//     } catch (error) {
//         throw Error(error.message);
//     }
// });

// const initialState = {
//     isLoading: true,
//     error: null,
//     data: null,
//     relationshipData: [],
//     openUpdate: false,
// };

// const profileSlice = createSlice({
//     name: "profile",
//     initialState,
//     reducers: {
//         setOpenUpdate(state, action) {
//             state.openUpdate = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchProfile.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//         builder.addCase(fetchProfile.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.data = action.payload;
//         })
//         builder.addCase(fetchProfile.rejected, (state, action) => {
//             state.isLoading = false;
//             state.error = action.error.message;
//         })
//         builder.addCase(fetchRelationships.pending, (state) => {
//             state.isLoading = true;
//             state.error = null;
//         })
//         builder.addCase(fetchRelationships.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.relationshipData = action.payload;
//         })
//         builder.addCase(fetchRelationships.rejected, (state, action) => {
//             state.isLoading = false;
//             state.error = action.error.message;
//         })
//         builder.addCase(followUser.fulfilled, (state, action) => {
//             const userId = action.payload;
//             const isFollowing = state.relationshipData.includes(userId);
//             if (isFollowing) {
//                 state.relationshipData = state.relationshipData.filter((id) => id !== userId);
//             } else {
//                 state.relationshipData.push(userId);
//             }
//         })
//         builder.addCase(followUser.rejected, (state, action) => {
//             state.error = action.error.message;
//         });
//     },
// });

// export const { setOpenUpdate } = profileSlice.actions;

// export default profileSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    comments: [],
    loading: false,
    error: null,
};

export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async(postId) => {
        try {
            const response = await axios.get(`http://localhost:3000/comments?postId=${postId}`);
            return response.data;
        } catch (error) {
            throw new Error("Failed to fetch comments.");
        }
    }
);

export const addComment = createAsyncThunk(
    "comments/addComment",
    async({ desc, postId }) => {
        try {
            const response = await axios.post("http://localhost:3000/addcomment", { desc, postId });
            return response.data;
        } catch (error) {
            throw new Error("Failed to add comment.");
        }
    }
);

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
        builder.addCase(fetchComments.fulfilled, (state, action) => {
            state.loading = false;
            state.comments = action.payload;
        })
        builder.addCase(fetchComments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        builder.addCase(addComment.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(addComment.fulfilled, (state, action) => {
            state.loading = false;
            state.comments.push(action.payload);
        })
        builder.addCase(addComment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const selectComments = (state) => state.comments.comments;
export const selectLoading = (state) => state.comments.loading;
export const selectError = (state) => state.comments.error;

export default commentsSlice.reducer;
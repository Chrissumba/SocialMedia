import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLikes = createAsyncThunk(
    "posts/fetchLikes",
    async(postId) => {
        try {
            const response = await axios.get(`http://localhost:3000/likes?postId=${postId}`);
            return { postId, likes: response.data };
        } catch (error) {
            throw new Error("Failed to fetch likes.");
        }
    }
);

export const addLike = createAsyncThunk(
    "posts/addLike",
    async(postId) => {
        try {
            await axios.post("http://localhost:3000/likes", { postId });
            return postId;
        } catch (error) {
            throw new Error("Failed to add like.");
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async(postId) => {
        try {
            await axios.delete(`http://localhost:3000/posts/${postId}`);
            return postId;
        } catch (error) {
            throw new Error("Failed to delete post.");
        }
    }
);

export const deleteLike = createAsyncThunk(
    "posts/deleteLike",
    async({ postId, likeId }) => {
        try {
            await axios.delete(`http://localhost:3000/likes/${likeId}`);
            return { postId, likeId };
        } catch (error) {
            throw new Error("Failed to delete like.");
        }
    }
);

const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLikes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
        builder.addCase(fetchLikes.fulfilled, (state, action) => {
            state.loading = false;
            const { postId, likes } = action.payload;
            const post = state.posts.find((p) => p.id === postId);
            if (post) {
                post.likes = likes;
            }
        })
        builder.addCase(fetchLikes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        builder.addCase(addLike.fulfilled, (state, action) => {
            const postId = action.payload;
            const post = state.posts.find((p) => p.id === postId);
            if (post) {
                post.likes += 1;
            }
        })
        builder.addCase(deletePost.fulfilled, (state, action) => {
            const postId = action.payload;
            state.posts = state.posts.filter((p) => p.id !== postId);
        })
        builder.addCase(deleteLike.fulfilled, (state, action) => {
            const { postId, likeId } = action.payload;
            const post = state.posts.find((p) => p.id === postId);
            if (post) {
                post.likes -= 1;
                post.likes = post.likes < 0 ? 0 : post.likes;
                post.likes = post.likes.filter((l) => l.id !== likeId);
            }
        });
    },
});

export const selectPosts = (state) => state.posts.posts;
export const selectLoading = (state) => state.posts.loading;
export const selectError = (state) => state.posts.error;

export default postSlice.reducer;
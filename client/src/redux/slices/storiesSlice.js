import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../../axios";

// Async Thunk for fetching stories
export const fetchStories = createAsyncThunk("stories/fetchStories", async() => {
    const response = await makeRequest.get("http://localhost:3000/getstory");
    return response.data;
});

// Async Thunk for adding a story
export const addStory = createAsyncThunk("stories/addStory", async(newStory) => {
    const response = await makeRequest.post("http://localhost:3000/addstory", newStory);
    return response.data;
});

const storiesSlice = createSlice({
    name: "stories",
    initialState: {
        stories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStories.fulfilled, (state, action) => {
                state.loading = false;
                state.stories = action.payload;
            })
            .addCase(fetchStories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addStory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addStory.fulfilled, (state, action) => {
                state.loading = false;
                state.stories.push(action.payload);
            })
            .addCase(addStory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const selectStories = (state) => state.stories.stories;
export const selectLoading = (state) => state.stories.loading;
export const selectError = (state) => state.stories.error;

export default storiesSlice.reducer;
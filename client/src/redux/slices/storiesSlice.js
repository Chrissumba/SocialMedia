import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Import Axios

// Your Cloudinary upload function (similar to the provided example)
const uploadImageToCloudinary = async(file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "<your upload preset>");

    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/<your cloud name>/image/upload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        throw new Error("Failed to upload file.");
    }
};

export const fetchStories = createAsyncThunk("stories/fetchStories", async() => {
    try {
        const response = await axios.get("http://localhost:3000/getstory");
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch stories.");
    }
});

export const addStory = createAsyncThunk("stories/addStory", async(newStory) => {
    try {
        const response = await axios.post("http://localhost:3000/addstory", newStory);
        return response.data;
    } catch (error) {
        throw new Error("Failed to add story.");
    }
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
        builder.addCase(fetchStories.fulfilled, (state, action) => {
            state.loading = false;
            state.stories = action.payload;
        })
        builder.addCase(fetchStories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        builder.addCase(addStory.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(addStory.fulfilled, (state, action) => {
            state.loading = false;
            state.stories.push(action.payload);
        })
        builder.addCase(addStory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const selectStories = (state) => state.stories.stories;
export const selectLoading = (state) => state.stories.loading;
export const selectError = (state) => state.stories.error;

export default storiesSlice.reducer;
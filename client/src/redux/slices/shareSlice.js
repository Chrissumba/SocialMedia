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

export const uploadFile = createAsyncThunk("share/uploadFile", async(file) => {
    try {
        const uploadedImageUrl = await uploadImageToCloudinary(file);
        return uploadedImageUrl;
    } catch (error) {
        throw new Error("Failed to upload file.");
    }
});

export const createPost = createAsyncThunk("share/createPost", async({ desc, img }) => {
    try {
        const response = await axios.post("http://localhost:3000/addpost", { desc, img }); // Use axios.post instead of makeRequest.post
        return response.data;
    } catch (error) {
        throw new Error("Failed to create post.");
    }
});

const shareSlice = createSlice({
    name: "share",
    initialState: {
        file: null,
        desc: "",
        loading: false,
        error: null,
    },
    reducers: {
        setFile: (state, action) => {
            state.file = action.payload;
        },
        setDesc: (state, action) => {
            state.desc = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.loading = false;
                state.fileUrl = action.payload; // Update the state with the uploaded image URL
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.post = action.payload;
                state.file = null;
                state.desc = "";
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setFile, setDesc } = shareSlice.actions;

export const selectFile = (state) => state.share.file;
export const selectDesc = (state) => state.share.desc;
export const selectLoading = (state) => state.share.loading;
export const selectError = (state) => state.share.error;

export default shareSlice.reducer;
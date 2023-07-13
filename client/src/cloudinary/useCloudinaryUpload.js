import { useState } from "react";
import cloudinary from "./cloudinaryConfig";

export const useCloudinaryUpload = () => {
    const [imageURL, setImageURL] = useState(null);

    const uploadImage = async(file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "oddtbybm");

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinary.cloud_name}/upload`, {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                setImageURL(data.secure_url);
                return data.secure_url;
            } else {
                throw new Error("Failed to upload image to Cloudinary.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return { imageURL, uploadImage };
};
import React, { useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStories, selectStories, selectLoading, selectError, addStory } from "../../redux/slices/storiesSlice";

import { AuthContext } from "../../context/authContext";
import "./stories.scss";

const Stories = () => {
  const stories = useSelector(selectStories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);

  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const uploadImageToCloudinary = async (file) => {
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

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    setImage(file);

    try {
      const imgUrl = await uploadImageToCloudinary(file);

      // Dispatch an action to add the story with the uploaded image URL
      // You can replace "My Story" with any other relevant property for the story
      dispatch(addStory({ url: imgUrl, name: "My Story" }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="stories">
      <div className="story">
        <input type="file" accept="image/*" onChange={handleUpload} />
        <span>{currentUser.name}</span>
        <button>+</button>
      </div>
      {error ? (
        <div className="error">Something went wrong</div>
      ) : loading ? (
        <div className="loading">Loading...</div>
      ) : (
        stories.map((story) => (
          <div className="story" key={story.id}>
            <img src={story.url} alt="" />
            <span>{story.name}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Stories;

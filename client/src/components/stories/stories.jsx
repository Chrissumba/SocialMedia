import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStories, selectStories, selectLoading, selectError } from "../../redux/slices/storiesSlice";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import { AuthContext } from "../../context/authContext";
import "./stories.scss";

const Stories = () => {
  const stories = useSelector(selectStories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const { uploadImage } = useCloudinaryUpload();

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    // Upload the file to Cloudinary
    const result = await uploadImage(file);

    if (result && result.url) {
      // Dispatch an action to add the story with the uploaded image URL
      // You can replace "name" with any other relevant property for the story
      dispatch(addStory({ url: result.url, name: "My Story" }));
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

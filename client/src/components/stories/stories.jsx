import React, { useContext, useState, useRef } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StoryDetail from "../storydetail/storydetail"; 
const Stories = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const fileInputRef = useRef(null);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/getstory").then((res) => res.data)
  );

  const queryClient = useQueryClient();

  const generateUniqueFileName = (file) => {
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = file.name.split(".").pop();
    const newFileName = `${Date.now()}-${randomString}.${fileExtension}`;
    return new File([file], newFileName, { type: file.type });
  };

  const upload = async () => {
    try {
      if (!cover) return null;
      const updatedCover = generateUniqueFileName(cover);
      const formData = new FormData();
      formData.append("file", updatedCover);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation(
    (newstory) => {
      return makeRequest.post("/addstory", newstory);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCover(file);

    // Display image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();
    mutation.mutate({ img: imgUrl, name: currentUser.name }); // Trigger the mutation to add the story
    setCover(null); // Reset the cover state after posting the story
  };

  const handleAddStoryClick = () => {
    fileInputRef.current.click();
  };
  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  return (
    <div className="stories">
      <div className="stories-container">
        {error ? (
          <div>Error: {error.message}</div>
        ) : isLoading ? (
          <div>Loading...</div>
        ) : Array.isArray(data) && data.length > 0 ? (
          data.map((story) => (
            <div className="story" key={story.storyId} onClick={() => handleStoryClick(story)}>
              <div className="story-image">
                <img src={story.storyImage} alt="" />
              </div>
              <span>{story.username}</span>
            </div>
          ))
          
        ) : (
          <div>No stories available.</div>
        )}
      </div>
      <div className="add-story">
        <div className="bottom-left">
          <div className="user-info">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button onClick={handleAddStoryClick}>+</button>
            <span>{currentUser.name}</span>
          </div>
        </div>
        <div className="bottom-right">
          {cover && <img className="file" alt="" src={URL.createObjectURL(cover)} />} {/* Display the image preview */}
          <button onClick={handleClick}>Share</button>
        </div>
      </div>
      {selectedStory && (
        <div className="modal">
          <StoryDetail story={selectedStory} />
          <button onClick={() => setSelectedStory(null)}>Close</button>
        </div>
      )}
    </div>
  );
};


export default Stories;

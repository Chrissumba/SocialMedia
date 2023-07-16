import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFile, setDesc, createPost, selectFile, selectDesc, selectLoading, selectError } from "../../redux/slices/shareSlice";
import { AuthContext } from "../../context/authContext";

import Image from "../../assets/Image.png";
import Map from "../../assets/Map.png";
import Friend from "../../assets/Friend.png";
import "./share.scss";

const Share = () => {
  const file = useSelector(selectFile);
  const desc = useSelector(selectDesc);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);

  const [image, setImage] = useState("");

  const uploadImageToCloudinary = async (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);
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
    dispatch(setFile(file));

    try {
      const imgUrl = await uploadImageToCloudinary(file);
      setImage(imgUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch(createPost({ desc, img: image }));
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => dispatch(setDesc(e.target.value))}
              value={desc}
            />
          </div>
          <div className="right">
            {file && <img className="file" alt="" src={URL.createObjectURL(file)} />}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
      </div>

      {/* Display the uploaded image */}
      {image && (
        <img
          src={image}
          alt="uploaded image"
        />
      )}
    </div>
  );
};

export default Share;

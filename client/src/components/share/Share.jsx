import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFile,
  setDesc,
  uploadFile,
  createPost,
  selectFile,
  selectDesc,
  selectLoading,
  selectError,
} from "../../redux/slices/shareSlice";
import { AuthContext } from "../../context/authContext";
import { useCloudinaryUpload } from "../../cloudinary/useCloudinaryUpload";
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
  const { uploadImage } = useCloudinaryUpload();

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    dispatch(setFile(file));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) {
      imgUrl = await uploadImage(file);
    }
    dispatch(createPost({ desc, img: imgUrl }));
    dispatch(addStory({ url: imgUrl, name: "My Story" }));
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
      </div>
    </div>
  );
};

export default Share;

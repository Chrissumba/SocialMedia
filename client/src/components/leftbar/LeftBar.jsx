import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./leftbar.scss";
import Friends from "../../assets/1.png";
import EventsIcon from "@mui/icons-material/Event";
import GalleryIcon from "@mui/icons-material/PhotoLibrary";
import TutorialsIcon from "@mui/icons-material/MenuBook";
import CoursesIcon from "@mui/icons-material/School";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import FriendsModal from "./friendsModal";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;
  const navigate = useNavigate();

  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friendsList, setFriendsList] = useState([]);

  // Fetch followers data
  const { isLoading: followersLoading, data: followersData } = useQuery(
    ["followers"],
    () => makeRequest.get(`/getfollow/${userId}`).then((res) => res.data)
  );

  // Fetch following data
  const { isLoading: followingLoading, data: followingData } = useQuery(
    ["following"],
    () => makeRequest.get(`/followedusers/${userId}`).then((res) => res.data)
  );

  // Combine the followers and following data to create a list of friends
  const friends = [
    ...(followersData || []),
    ...(followingData || []),
  ];

  const handleFriendsClick = () => {
    setFriendsList(friends);
    setShowFriendsModal(true);
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <span>{currentUser.name}</span>
          </div>
          <div className="item" onClick={handleFriendsClick}>
            <img src={Friends} alt="" />
            <span>Friends</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <EventsIcon />
            <span>Events</span>
          </div>
          <div className="item">
            <GalleryIcon />
            <span>Gallery</span>
          </div>
          <div className="item">
            <TutorialsIcon />
            <span>Tutorials</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <CoursesIcon />
            <span>Courses</span>
          </div>
        </div>
      </div>

      {/* Show the friends modal when showFriendsModal is true */}
      {showFriendsModal && (
      <FriendsModal
        onClose={() => setShowFriendsModal(false)}
        friends={friendsList}
        title="Your Friends" // Provide the title prop here
      />
    )}
  </div>
);
};

export default LeftBar;

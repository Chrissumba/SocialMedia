import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./leftbar.scss";
import Friends from "../../assets/1.png";
import LogoutIcon from '@mui/icons-material/Logout';
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
  const [showSettingsMenu, setShowSettingsMenu] = useState(false); // New state variable for settings menu

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

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Make a POST request to the logout endpoint on your server
      await makeRequest.post("/logout");
      // Once the server responds successfully, navigate the user to the login page
      navigate("/login");
    } catch (error) {
      // Handle any errors that may occur during the logout process
      console.error("Error occurred during logout:", error);
      // Display an error message to the user, if needed
    }
  };

  const handleSettingsClick = () => {
    setShowSettingsMenu((prevValue) => !prevValue);
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
          <div className="item" onClick={handleSettingsClick}>
            <CoursesIcon />
            <span>Settings</span>
          </div>
          {/* Show the logout icon if the settings menu is open */}
          {showSettingsMenu && (
            <div className="item" onClick={handleLogout}>
              <LogoutIcon />
              <span>Logout</span>
            </div>
          )}
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

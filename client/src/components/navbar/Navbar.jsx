import React, { useState, useContext, useEffect } from 'react';
import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined"; 
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (searchTerm) => {
    try {
      if (searchTerm.trim() === '') {
        // If the search term is empty, reset the search results to an empty array
        setSearchResults([]);
      } else {
        const response = await makeRequest.get(`/name/${searchTerm}`);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Inbound media.</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <div className="search">
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search for a user"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="right">
        {/* Link to the notifications page */}
        <Link to="/notification" style={{ textDecoration: "none", color: "inherit" }}>
          <NotificationsOutlinedIcon />
        </Link>
        <div className="user">
          {/* Link to the user's profile page */}
          <Link to={`/profile/${currentUser.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src={"/upload/" + currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </Link>
        </div>
      </div>
      {/* Display search results */}
      <div className="search-results">
        <ul>
          {searchResults.map((user) => (
            <li className="user" key={user.id}>
              {/* Use Link to navigate to the user's profile */}
              <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {user.profilePic && <img src={user.profilePic} alt="Profile Pic" />}
                <span>{user.username}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

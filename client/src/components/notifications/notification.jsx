import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import "./notification.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getnotification/${currentUser.id}`,
        {
          withCredentials: true,
        }
      );

      console.log("Fetched notifications data:", response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setErrorMessage("An error occurred while fetching notifications.");
    }
  };

  const markNotificationAsRead = async (notification_id) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/markread/${notification_id}`,
        {},
        {
          withCredentials: true,
        }
      );
  
      console.log("Response data:", response.data);
  
      if (response.data.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.notification_id !== notification_id
          )
        );
        setSuccessMessage("Notification marked as read successfully.");
  
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
  
        // Clear the error message (if any) immediately
        setErrorMessage("");
      } else {
       // setErrorMessage("Failed to mark notification as read.");
        setSuccessMessage("");
  
        // Clear the error message after 3 seconds
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } catch (error) {
      console.log("Error while marking notification as read:", error);
      setErrorMessage("An error occurred while marking notification as read.");
  
      // Clear the error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
  
      // Clear the success message (if any) immediately
      setSuccessMessage("");
    }
  };
  
  
  
  return (
    <div className="notifications-container">
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="notifications-header">
        <h2 className="notifications-heading">Notifications</h2>
      </div>
      {notifications.map((notification) => (
        <div
          key={notification.notification_id} // Use notification_id as the unique key prop
          className={`notification ${notification.isRead ? "read" : "unread"}`}
        >
          <img
            src={notification.sender_profile_picture || ""}
            alt="Profile"
            className="profile-picture"
            onClick={() => markNotificationAsRead(notification.notification_id)}
          />
          <div className="notification-details">
            <h3
              onClick={() => markNotificationAsRead(notification.notification_id)}
            >
              {notification.sender_username}
            </h3>
            <p
              className="notification-message"
              onClick={() => markNotificationAsRead(notification.notification_id)}
            >
              {notification.message}
            </p>
            <p className="notification-description">
              {notification.description}
            </p>
          </div>
          {!notification.isRead && (
            <AiOutlineCheckCircle
              className="notification-icon"
              onClick={() => markNotificationAsRead(notification.notification_id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;

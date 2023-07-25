import React from "react";
import { useNavigate } from "react-router-dom";
import "./modal.scss";

const Modal = ({ onClose, data }) => {
    const navigate = useNavigate();

    // Check if data.users is not defined or empty
    const hasUsers = data && data.users && data.users.length > 0;

    // Get the count of users
    const userCount = data && data.users ? data.users.length : 0;

    const handleUserProfileClick = (userId) => {
        // Navigate to the profile page of the clicked user
        navigate(`/profile/${userId}`);
    };

    return ( <
        div className = "modal-overlay"
        onClick = { onClose } >
        <
        div className = "modal-content"
        onClick = {
            (e) => e.stopPropagation() } >
        <
        h2 > { data.title }({ userCount }) <
        /h2> {
            hasUsers ? ( <
                ul className = "user-list" > {
                    data.users.map((user) => ( <
                        li key = { user.id }
                        className = "user-item"
                        onClick = {
                            () => handleUserProfileClick(user.id) } >
                        <
                        img src = { "/upload/" + user.profilePic }
                        alt = { user.name }
                        className = "user-avatar" /
                        >
                        <
                        span className = "user-name" > { user.name } < /span> <
                        /li>
                    ))
                } <
                /ul>
            ) : ( <
                p > No users to display. < /p>
            )
        } <
        /div> <
        /div>
    );
};

export default Modal;
// SingleStoryModal.js

import React from "react";
import "./storydetail.scss";

const SingleStoryModal = ({ story, onClose }) => {
    return ( <
        div className = "modal-overlay"
        onClick = { onClose } >
        <
        div className = "modal-content" >
        <
        div className = "story-image" >
        <
        img src = { story.storyImage }
        alt = "Story" / >
        <
        /div> <
        div className = "story-details" >
        <
        div className = "user-profile-pic" >
        <
        img src = { story.profilePic }
        alt = "User Profile" / >
        <
        /div> <
        h3 > { story.username } < /h3> <
        p > { story.createdAt } < /p> { /* Add other story details here as needed */ } <
        /div> <
        /div> <
        /div>
    );
};

export default SingleStoryModal;
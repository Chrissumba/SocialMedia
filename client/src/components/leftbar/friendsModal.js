import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./friendslist.scss";
import { useNavigate } from "react-router-dom";

const FriendsModal = ({ onClose, friends }) => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch following data using useQuery
    const { isLoading: followingLoading, data: followingData } = useQuery(
        ["following"],
        () =>
        makeRequest.get(`/followedusers/${currentUser.id}`).then((res) => {
            console.log("Following Data:", res.data);
            return res.data;
        })
    );

    const isFollowing = (userId) => {
        return followingData && followingData.some((followedUser) => followedUser.id === userId);
    };

    const handleFollow = (userId) => {
        // Implement the follow functionality here, e.g., using a mutation function.
        // You can use the `isFollowing` function to decide whether to follow or unfollow the user.
        console.log("Follow", userId);
    };

    const handleProfileClick = (userId) => {
        // Use the navigate function to navigate to the profile page of the user
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
        h2 > Your Friends < /h2> {
            friends.length > 0 ? ( <
                ul className = "user-list" > {
                    friends.map((friend) => ( <
                        li key = { friend.id }
                        className = "user-item" >
                        <
                        img src = { "/upload/" + friend.profilePic }
                        alt = { friend.name }
                        className = "user-avatar"
                        onClick = {
                            () => handleProfileClick(friend.id) }
                        /> <
                        span className = "user-name" > { friend.name } < /span> {
                            friend.id !== currentUser.id && !isFollowing(friend.id) ? ( <
                                button onClick = {
                                    () => handleFollow(friend.id) } >
                                Follow <
                                /button>
                            ) : ( <
                                button onClick = {
                                    () => handleFollow(friend.id) } >
                                Unfollow <
                                /button>
                            )
                        } <
                        /li>
                    ))
                } <
                /ul>
            ) : ( <
                p > No friends to display. < /p>
            )
        } <
        /div> <
        /div>
    );
};

export default FriendsModal;
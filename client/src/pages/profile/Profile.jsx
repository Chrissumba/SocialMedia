import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/update";
import { useState } from "react";
import Modal from "../Modal/modal";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  // Fetch followers data
  const { isLoading: followersLoading, data: followersData } = useQuery(
    ["followers"],
    () =>
      makeRequest.get(`/getfollow/${userId}`).then((res) => {
        console.log("Followers Data:", res.data); // Add the console.log statement here
        return res.data;
      })
  );

  // Fetch following data
  const { isLoading: followingLoading, data: followingData } = useQuery(
    ["following"],
    () =>
      makeRequest.get(`/followedusers/${userId}`).then((res) => {
        console.log("Following Data:", res.data); // Add the console.log statement here
        return res.data;
      })
  );

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/user/" + userId).then((res) => {
      return res.data;
    })
  );
  console.log("User Data:", data);

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get(`/getfollow/${userId}`).then((res) => {
        setIsFollowing(res.data.includes(currentUser.id));
        return res.data;
      })
  );
  console.log("Relationship data:", data);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following) {
        return makeRequest.delete(`/deletefollow?userId=${userId}`);
      }
      return makeRequest.post("/addfollow", { followedUserId: userId });
    },
    {
      onMutate: (following) => {
        queryClient.setQueryData(["relationship"], (prevData) => {
          return following
            ? prevData.filter((id) => id !== currentUser.id)
            : [...prevData, currentUser.id];
        });
      },
      onError: (error, variables, rollback) => {
        rollback();
        console.error("Error performing the follow/unfollow action:", error);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );
  
  const handleFollow = () => {
    const following = relationshipData && relationshipData.includes(currentUser.id);
    console.log("Current Relationship Status:", following ? "Following" : "Not Following");
    mutation.mutate(following);
  };
  

  const handleFollowersClick = () => {
    setOpenFollowersModal(true);
  };

  const handleFollowingClick = () => {
    setOpenFollowingModal(true);
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={"/upload/" + data.coverPic} alt="" className="cover" />
            <img
              src={"/upload/" + data.profilePic}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <div className="ownProfileButtons">
                    <button onClick={() => setOpenUpdate(true)}>Update</button>
                    <button onClick={handleFollowersClick}>Followers</button>
                    <button onClick={handleFollowingClick}>Following</button>
                  </div>
                ) : (
                  <div className="followButtons">
                  {rIsLoading ? (
                    "Loading..."
                  ) : (
                    <button onClick={handleFollow}>
                      {relationshipData && relationshipData.includes(currentUser.id)
                        ? "Following"
                        : "Follow"}
                    </button>
                  )}
                  <button onClick={handleFollowersClick}>Followers</button>
                  <button onClick={handleFollowingClick}>Following</button>
                </div>
                
                
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}

      {openFollowersModal && (
        <Modal
          onClose={() => setOpenFollowersModal(false)}
          data={{
            title: "Followers",
            users: followersData,
          }}
        />
      )}

      {openFollowingModal && (
        <Modal
          onClose={() => setOpenFollowingModal(false)}
          data={{
            title: "Following",
            users: followingData,
          }}
        />
      )}
    </div>
  );
};

export default Profile;

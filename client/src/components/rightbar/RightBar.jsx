import "./rightBar.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["recommendations"], () =>
    makeRequest.get(`/recomend/${currentUser.id}`).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const followMutation = useMutation(
    (userIdToFollow) => makeRequest.post("/addfollow", { followedUserId: userIdToFollow }),
    {
      onMutate: (userIdToFollow) => {
        // Update the local state optimistically before the mutation is resolved.
        queryClient.setQueryData(["recommendations"], (prevData) => {
          // Add the user to the data array optimistically.
          return [...prevData, { user_id: userIdToFollow }];
        });
      },
      onSettled: () => {
        // Refetch the recommendations data after the mutation is resolved to get the updated data from the server.
        queryClient.invalidateQueries(["recommendations"]);
      },
    }
  );

  const handleFollow = (userIdToFollow) => {
    followMutation.mutate(userIdToFollow);
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            data.map((user) => (
              <div className="user" key={user.user_id}>
                <div className="userInfo">
                  {/* Add the Link to the user's profile page */}
                  <Link to={`/profile/${user.user_id}`}>
                    <img src={user.user_profile_pic} alt="" />
                  </Link>
                  <span>{user.user_name}</span>
                </div>
                <div className="buttons">
                  <button onClick={() => handleFollow(user.user_id)}>follow</button>
                  <button>dismiss</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="item">
          <span>Your Notifications</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Chris</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Clare Chege</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          {/* Rest of the notification items */}
        </div>
        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          {/* Rest of the online friend items */}
        </div>
      </div>
    </div>
  );
};

export default RightBar;

import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/comments";
import { useState } from "react";
import { format } from "timeago.js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  
// const { isLoading, error, data = [] } = useQuery(["likes"], () =>
//   makeRequest.get(`/postlikes/${post.id}`).then((res) => {
//     return res.data.flat(); // Convert 2D array to a flat array of userIds
//   })
// );
const { isLoading, error, data = [] } = useQuery(["likes", post.id], () =>
makeRequest.get(`/postlikes/${post.id}`).then((res) => {
  return res.data.flat();
})
);


 // console.log(data);

  const queryClient = useQueryClient();

  // const mutation = useMutation(
  //   (liked) => {
  //     if (liked) return makeRequest.delete(`/deletelike/${post.id}`);
  //     return makeRequest.post("/addlike", { postId: post.id });
  //   },
  //   {
  //     onSuccess: () => {
  //       // Invalidate and refetch
  //       queryClient.invalidateQueries(["likes"]);
  //     },
  //   }
  // );
  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete(`/deletelike/${post.id}`);
      return makeRequest.post("/addlike", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch only the specific post's "likes" query
        queryClient.invalidateQueries(["likes", post.id]);
      },
    }
  );
  
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/deletepost/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    // Use optional chaining (?.) to check if data is an array before using includes
    const isLiked = Array.isArray(data) && data.includes(currentUser.id);
    mutation.mutate(isLiked);
  };
  

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };
  const convertToCustomFormat = (isoDateString) => {

    const dateObject = new Date(isoDateString);

    const year = dateObject.getUTCFullYear();

    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');

    const day = dateObject.getUTCDate().toString().padStart(2, '0');

    const hours = dateObject.getUTCHours().toString().padStart(2, '0');

    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');

    const seconds = dateObject.getUTCSeconds().toString().padStart(2, '0');

    const milliseconds = dateObject.getUTCMilliseconds().toString().padStart(3, '0');




    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}000`;

  };


  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/"+post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{format(convertToCustomFormat(post.createdAt))}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.description}</p>
          <img src={"/upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
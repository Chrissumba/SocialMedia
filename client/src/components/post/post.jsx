import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import moment from "moment";
import { addLike, deletePost, deleteLike, selectPosts } from "../../redux/slices/postSlice";

const Post = ({ post }) => {
const [commentOpen, setCommentOpen] = useState(false);
const dispatch = useDispatch();
const posts = useSelector(selectPosts);

const handleLike = () => {
if (post.likes.includes(currentUser.id)) {
dispatch(deleteLike({ postId: post.id, likeId: post.likes.find((like) => like.userId === currentUser.id).id }));
} else {
dispatch(addLike(post.id));
}
};

const handleDelete = () => {
dispatch(deletePost(post.id));
};

return (
<div className="post">
<div className="container">
<div className="user">
<div className="userInfo">
<img src={"/upload/"+post.profilePic} alt="" />
<div className="details">
<Link
to={/profile/${post.userId}}
style={{ textDecoration: "none", color: "inherit" }}
>
<span className="name">{post.name}</span>
</Link>
<span className="date">{moment(post.createdAt).fromNow()}</span>
</div>
</div>
<MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
{menuOpen && post.userId === currentUser.id && (
<button onClick={handleDelete}>delete</button>
)}
</div>
<div className="content">
<p>{post.desc}</p>
<img src={"/upload/" + post.img} alt="" />
</div>
<div className="info">
<div className="item">
{post.likes.includes(currentUser.id) ? (
<FavoriteOutlinedIcon
style={{ color: "red" }}
onClick={handleLike}
/>
) : (
<FavoriteBorderOutlinedIcon onClick={handleLike} />
)}
{post.likes.length} Likes
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
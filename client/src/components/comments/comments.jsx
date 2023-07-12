import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, selectComments } from "./commentsSlice";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const dispatch = useDispatch();
  const comments = useSelector(selectComments);

  const handleClick = (e) => {
    e.preventDefault();
    if (desc.trim() === "") return; // Ignore empty comments
    dispatch(addComment({ desc, postId }));
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={"/upload/" + comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;

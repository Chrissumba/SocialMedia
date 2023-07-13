import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, fetchComments, selectComments, selectLoading, selectError } from "../../redux/slices/commentsSlice";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import "./comments.scss";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const dispatch = useDispatch();
  const comments = useSelector(selectComments);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

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
      {error ? (
        "Something went wrong"
      ) : loading ? (
        "Loading..."
      ) : (
        comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={"/upload/" + comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;

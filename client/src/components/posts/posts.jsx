// Posts.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, selectPosts, selectLoading, selectError } from "./postsSlice";
import Post from "../post/post";
import "./posts.scss";

const Posts = ({ userId }) => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchPosts(userId));
  }, [dispatch, userId]);

  return (
    <div className="posts">
      {error ? (
        "Something went wrong!"
      ) : loading ? (
        "Loading..."
      ) : (
        posts.map((post) => <Post post={post} key={post.id} />)
      )}
    </div>
  );
};

export default Posts;

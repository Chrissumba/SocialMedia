import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { format } from "timeago.js";

const Comments = ({ postId }) => {
  const [description, setdescription] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments"], () =>
  makeRequest.get(`/comments/${postId}`).then((res) => {
    return res.data;
  })
);


  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/addcomment", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ description, postId });
    setdescription("");
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
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error ? (
  "Something went wrong"
) : isLoading ? (
  "loading"
) : !Array.isArray(data) ? (
  <>
  "There are no comments for this post, feel free to add a comment, "
  {currentUser.name}.
</>
) : (
  data.map((comment) => (
    <div className="comment" key={comment.id}>
      <img src={"/upload/" + comment.profilePic} alt="" />
      <div className="info">
        <span>{comment.name}</span>
        <p>{comment.description}</p>
      </div>
     
      <span className="date">{format(convertToCustomFormat(comment.createdAt))}</span>
    </div>
  ))
)}

    </div>
  );
};

export default Comments;


// import React, { useState, useEffect, useContext } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addComment, fetchComments, selectComments, selectLoading, selectError } from "../../redux/slices/commentsSlice";
// import moment from "moment";
// import { AuthContext } from "../../context/authContext";
// import "./comments.scss";

// const Comments = ({ postId }) => {
//   const [description, setdescription] = useState("");
//   const dispatch = useDispatch();
//   const comments = useSelector(selectComments);
//   const loading = useSelector(selectLoading);
//   const error = useSelector(selectError);

//   const { currentUser } = useContext(AuthContext);

//   useEffect(() => {
//     dispatch(fetchComments(postId));
//   }, [dispatch, postId]);

//   const handleClick = (e) => {
//     e.preventDefault();
//     if (description.trim() === "") return; // Ignore empty comments
//     dispatch(addComment({ description, postId }));
//     setdescription("");
//   };

//   return (
//     <div className="comments">
//       <div className="write">
//         <img src={"/upload/" + currentUser.profilePic} alt="" />
//         <input
//           type="text"
//           placeholder="write a comment"
//           value={description}
//           onChange={(e) => setdescription(e.target.value)}
//         />
//         <button onClick={handleClick}>Send</button>
//       </div>
//       {error ? (
//         "Something went wrong"
//       ) : loading ? (
//         "Loading..."
//       ) : (
//         comments.map((comment) => (
//           <div className="comment" key={comment.id}>
//             <img src={"/upload/" + comment.profilePic} alt="" />
//             <div className="info">
//               <span>{comment.name}</span>
//               <p>{comment.description}</p>
//             </div>
//             <span className="date">{moment(comment.createdAt).fromNow()}</span>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Comments;

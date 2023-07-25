import React, { useContext, useState } from "react";
import "./replies.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { format } from "timeago.js";

const Replies = ({ commentId, postId }) => {
  const [description, setDescription] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["replies", commentId], () =>
    makeRequest
      .get(`/reply/${commentId}`)
      .then((res) => {
        const fetchedReplies = res.data;
        console.log("Fetched replies:", fetchedReplies);
        return fetchedReplies;
      })
      .catch((err) => {
        console.error("Error fetching replies:", err);
        throw err;
      })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newReply) => {
      return makeRequest.post("/addReply", newReply);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["replies", commentId]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ description, commentId, postId });
    setDescription("");
  };

  const convertToCustomFormat = (isoDateString) => {
    const dateObject = new Date(isoDateString);
    const year = dateObject.getUTCFullYear();
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.getUTCDate().toString().padStart(2, "0");
    const hours = dateObject.getUTCHours().toString().padStart(2, "0");
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, "0");
    const seconds = dateObject.getUTCSeconds().toString().padStart(2, "0");
    const milliseconds = dateObject
      .getUTCMilliseconds()
      .toString()
      .padStart(3, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}000`;
  };

  return (
    <div className="replies">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="Write a reply"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error ? (
        "Something went wrong"
      ) : isLoading ? (
        "Loading..."
      ) : !Array.isArray(data) ? (
        `There are no replies for this comment, feel free to add a reply, ${currentUser.name}.`
      ) : (
        data.map((reply) => (
          <div className="reply" key={reply.id}>
            <img src={"/upload/" + reply.profilePic} alt="" />
            <div className="info">
              <span>{reply.name}</span>
              <p>{reply.description}</p>
            </div>
            <span className="date">
              {format(convertToCustomFormat(reply.createdAt))}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default Replies;

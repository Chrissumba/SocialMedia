const express = require('express');
const {
    getComments,
    addComment,
    deleteComment,
} = require('../controllers/comment')

const commentsrouter = express.Router();

commentsrouter.get("/comments/:postId", getComments);
commentsrouter.post("/addcomment", addComment);
commentsrouter.delete("/deletecomment/:id", deleteComment);

module.exports = commentsrouter
const express = require('express');
const postrouter = express.Router();
const { getPosts, addPost, deletePost } = require('../controllers/post.js');


postrouter.get("/allposts/:userId", getPosts);
postrouter.post("/addpost", addPost);
postrouter.delete("/deletepost/:postId", deletePost)


module.exports = postrouter
const express = require('express');
const postrouter = express.Router();
const { getPosts, addPost, deletePost, getSinglePost } = require('../controllers/post.js');


postrouter.get("/allposts/:userId", getPosts);
postrouter.post("/addpost", addPost);
postrouter.delete("/deletepost/:id", deletePost)
postrouter.get('/singlepost/:id', getSinglePost)

module.exports = postrouter
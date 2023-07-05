const express = require('express');
const { getLikes, addLike, deleteLike } = require('../controllers/like.js');

const likesrouter = express.Router()

likesrouter.get("/postlikes", getLikes);
likesrouter.post("/addlike", addLike)
likesrouter.delete("/deletelike/:postId", deleteLike)


module.exports = likesrouter
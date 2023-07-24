const express = require('express');
const { getFollow, addFollow, deleteFollow } = require('../controllers/follow');
const { getFollowedUsers } = require('../controllers/follwing');

const followrouter = express.Router()

followrouter.get("/getfollow/:userId", getFollow)
followrouter.post("/addfollow", addFollow)
followrouter.delete("/deletefollow", deleteFollow)
followrouter.get("/followedusers/:userId", getFollowedUsers)


module.exports = followrouter
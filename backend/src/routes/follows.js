const express = require('express');
const { getFollow, addFollow, deleteFollow } = require('../controllers/follow');

const followrouter = express.Router()

followrouter.get("/getfollow/:userId", getFollow)
followrouter.post("/addfollow", addFollow)
followrouter.delete("/deletefollow", deleteFollow)


module.exports = followrouter
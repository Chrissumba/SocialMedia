const express = require('express');
const { getReplies, addReply } = require('../controllers/reply');

const replyrouter = express.Router();

replyrouter.get("/reply/:commentId", getReplies);
replyrouter.post("/addReply", addReply);

module.exports = replyrouter;
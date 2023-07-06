const express = require('express');
const { getStories, addStory, deleteStory, deleteExpiredStories } = require('../controllers/story.js');

const storyrouter = express.Router();

storyrouter.get("/getstory", getStories);
storyrouter.post("/addstory", addStory);
storyrouter.delete("/deletestory/:id", deleteStory);

module.exports = storyrouter
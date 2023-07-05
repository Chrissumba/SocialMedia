const express = require('express');
const { getUser, updateUser, getUserByName } = require('../controllers/user.js');

const userrouter = express.Router()

userrouter.get("/user/:userId", getUser)
userrouter.put("/updateUser/:userId", updateUser)
userrouter.get("/name/:name", getUserByName)

module.exports = userrouter
const express = require('express');
const authenticationRouter = express.Router();

const { register, login, logout } = require('../controllers/authenticationControllers')


authenticationRouter.post('/register', register);
authenticationRouter.post('/login', login);
authenticationRouter.post("/logout", logout)


module.exports = authenticationRouter
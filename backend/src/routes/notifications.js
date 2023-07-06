const express = require('express');
const { getNotifications } = require('../controllers/notification');

const notificationRouter = express.Router();

notificationRouter.get('/getnotification/:userId', getNotifications);

module.exports = notificationRouter;
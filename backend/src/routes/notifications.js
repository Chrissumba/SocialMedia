const express = require('express');
const { getNotifications, markNotificationAsRead, markAllasRead } = require('../controllers/notification');

const notificationRouter = express.Router();

notificationRouter.get('/getnotification/:userId', getNotifications);
notificationRouter.put('/markread/:notification_id', markNotificationAsRead); // Removed the space here
notificationRouter.put('/markall/:userid', markAllasRead); // Removed the space here

module.exports = notificationRouter;
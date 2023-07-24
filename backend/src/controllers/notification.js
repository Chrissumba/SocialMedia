const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const moment = require('moment')
require('dotenv').config()

async function getNotifications(req, res) {
    try {
        const userId = req.params.userId;
        const pool = await mssql.connect(config);

        console.log("Connected to the database");

        const q = `
            SELECT description, sourceid
            FROM Notifications
            WHERE userid = @userId
            ORDER BY created_at DESC;
        `;

        const request = pool.request();
        request.input('userId', mssql.Int, userId);

        console.log("Executing the query");

        const result = await request.query(q);

        console.log("Query executed successfully");

        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json("An error occurred");
    }
}

async function markNotificationAsRead(req, res) {
    try {
        const notificationId = req.params.notification_id;
        const pool = await mssql.connect(config);

        console.log("Connected to the database");

        const q = `
        UPDATE Notifications
        SET isRead = 1
        WHERE notification_id = ${notificationId};
      `;

        console.log("Executing the query");

        const result = await pool.request().query(q);

        console.log("Query executed successfully");

        // Send a success message back to Postman
        return res.status(200).json({
            message: "Notification marked as read successfully.",
            data: result.recordset // If you want to include the result data
        });
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json("An error occurred");
    }
}


async function markAllasRead(req, res) {
    try {
        const userid = req.params.userid;
        const pool = await mssql.connect(config);

        console.log("Connected to the database");

        const q = `
            UPDATE Notifications
            SET isRead = 1
            WHERE userid = @user_id;
        `;

        console.log("Executing the query");

        const request = pool.request();
        request.input('user_id', mssql.Int, userid);

        const result = await request.query(q);

        console.log("Query executed successfully");

        // Send a success message back to Postman
        return res.status(200).json({
            message: "All notifications for the user marked as read successfully.",
        });
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json("An error occurred");
    }
}


module.exports = { getNotifications, markNotificationAsRead, markAllasRead };
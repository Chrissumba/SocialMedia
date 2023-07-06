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

module.exports = { getNotifications };
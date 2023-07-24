const mssql = require('mssql');
const jwt = require('jsonwebtoken');
const { user } = require('../config/config');
const config = require('../config/config');
const moment = require('moment');
require('dotenv').config();

async function getFollowedUsers(req, res) {
    const token = req.session.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, config.secret, async(err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            const followerUserId = userInfo.id;
            const pool = await mssql.connect(config);

            const result = await pool
                .request()
                .input('followerUserId', mssql.Int, followerUserId)
                .query(`
                    SELECT U.id, U.username, U.email, U.name, U.coverPic, U.profilePic, U.city, U.website
                    FROM Users U
                    INNER JOIN Follow F ON U.id = F.followedUserId
                    WHERE F.followerUserId = @followerUserId
                `);

            const followedUsers = result.recordset;
            return res.status(200).json(followedUsers); // Send the followedUsers data in the response
        } catch (error) {
            console.error('An error occurred:', error);
            return res.status(500).json({ error: error.message });
        }
    });
}

module.exports = { getFollowedUsers };
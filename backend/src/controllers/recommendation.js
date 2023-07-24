const mssql = require('mssql');
const jwt = require('jsonwebtoken');
const { user } = require('../config/config');
const config = require('../config/config');
const moment = require('moment');
require('dotenv').config();

async function getRecomendation(req, res) {
    const token = req.session.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, config.secret, async(err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            const userId = userInfo.id; // User's ID from the decoded token
            const pool = await mssql.connect(config);

            const q = `
            SELECT TOP 2 U.id AS user_id, U.username AS user_username, U.name AS user_name, U.profilePic AS user_profile_pic, COUNT(F1.id) AS followers_count
            FROM Users U
            LEFT JOIN Follow F1 ON U.id = F1.followedUserId
            LEFT JOIN Follow F2 ON U.id = F2.followerUserId AND F1.followedUserId = F2.followedUserId
            WHERE F2.id IS NULL AND U.id <> @userId
            AND U.id NOT IN (
                SELECT followedUserId
                FROM Follow
                WHERE followerUserId = @userId
            )
            GROUP BY U.id, U.username, U.name, U.profilePic
            ORDER BY followers_count DESC;
            `;

            const request = pool.request();
            request.input('userId', mssql.Int, userId); // Set the @userId parameter in the query

            const result = await request.query(q);
            const recommendations = result.recordset;

            if (recommendations.length === 0) {
                return res.status(200).json({ message: 'No recommendations found.' });
            }

            return res.status(200).json(recommendations);
        } catch (error) {
            console.error('An error occurred:', error);
            return res.status(500).json({ error: error.message });
        }
    });
}

module.exports = { getRecomendation };
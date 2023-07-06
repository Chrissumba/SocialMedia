const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const moment = require('moment')
require('dotenv').config()

async function getStories(req, res) {
    try {
        const token = req.session.accessToken;
        if (!token) return res.status(401).json("Not logged in!");

        const userInfo = await jwt.verify(token, config.secret);
        const pool = await mssql.connect(sqlConfig);
        const query = `
            SELECT s.*, u.name
            FROM Stories AS s
            JOIN users AS u ON u.id = s.userId
            LEFT JOIN Follow AS r ON s.userId = r.followedUserId AND r.followerUserId = @followerUserId
            ORDER BY s.created_at DESC
            OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY;
        `;
        const request = pool.request();
        request.input("followerUserId", mssql.Int, userInfo.id);

        const result = await request.query(query);
        const stories = result.recordset;

        return res.status(200).json(stories);
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ error: error.message });
    }
}

async function addStory(req, res) {
    try {
        const token = req.session.accessToken;
        if (!token) return res.status(401).json("Not logged in!");

        const userInfo = await jwt.verify(token, config.secret);
        const pool = await mssql.connect(config);
        const query = `
            INSERT INTO Stories (img, createdAt, userId)
            VALUES (@img, GETDATE(), @userId)
        `;

        const values = {
            img: req.body.img,
            userId: userInfo.id
        };

        const request = pool.request();
        request.input("img", mssql.NVarChar, values.img);
        request.input("userId", mssql.Int, values.userId);

        const result = await request.query(query);
        return res.status(200).json("Story has been created.");
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ error: error.message });
    }
}



async function deleteStory(req, res) {
    try {
        const token = req.session.accessToken;
        if (!token) return res.status(401).json("Not logged in!");

        const userInfo = await jwt.verify(token, config.secret);
        const q = "DELETE FROM Stories WHERE id = @id AND userId = @userId";

        const pool = await mssql.connect(config);
        const request = pool.request();
        request.input('id', mssql.Int, req.params.id);
        request.input('userId', mssql.Int, userInfo.id);

        const result = await request.query(q);
        if (result.rowsAffected[0] > 0) {
            return res.status(200).json("Story has been deleted.");
        } else {
            return res.status(403).json("You can delete only your story!");
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ error: error.message });
    }
}



module.exports = { getStories, addStory, deleteStory };
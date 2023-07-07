const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const cron = require('node-cron')
const moment = require('moment')
require('dotenv').config()


async function deleteExpiredStories() {
    try {
        const pool = await mssql.connect(config);
        const query = `
        DELETE FROM Stories
        WHERE createdAt < DATEADD(MINUTE, -30, GETDATE())
      `;
        await pool.request().query(query);
        console.log('Expired stories have been deleted.');
    } catch (error) {
        console.error('An error occurred while deleting expired stories:', error);
    }
}

async function getStories(req, res) {
    try {
        const token = req.session.accessToken;
        if (!token) return res.status(401).json("Not logged in!");

        const userInfo = await jwt.verify(token, config.secret);
        const pool = await mssql.connect(config);
        const query = `
        SELECT U.username,U.id, S.img AS storyImage, S.createdAt, U.profilePic
        FROM Users U
        JOIN Follow F ON F.followedUserId = U.id
        JOIN Stories S ON S.userId = U.id
        WHERE F.followerUserId = @followerUserId
        ORDER BY S.createdAt DESC;
        
        `;
        const request = pool.request();
        request.input("followerUserId", mssql.Int, userInfo.id);

        const result = await request.query(query);
        const stories = result.recordset;

        // Additional step: Check if the user has any stories
        if (stories.length === 0) {
            return res.status(200).json({ message: "No stories found." });
        }

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



module.exports = { getStories, addStory, deleteStory, deleteExpiredStories };
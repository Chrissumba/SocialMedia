const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const moment = require('moment')
require('dotenv').config()

async function getPosts(req, res) {
    const userId = req.query.userId;
    const token = req.session.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    try {
        const userInfo = await jwt.verify(token, config.secret);
        const pool = await mssql.connect(config);

        const q = `
            SELECT p.*, u.id AS userId, u.name, u.profilePic
            FROM Posts AS p
            JOIN Users AS u ON u.id = p.userId
            JOIN Follow AS f ON f.followedUserId = p.userId
            WHERE f.followerUserId = @userId
            ORDER BY p.createdAt DESC
        `;

        const request = pool.request();
        request.input("userId", mssql.Int, userId || userInfo.id);

        const result = await request.query(q);
        return res.status(200).json(result.recordset);
    } catch (error) {
        return res.status(500).json(error);
    }
}
async function addPost(req, res) {
    const token = req.session.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, config.secret, async(err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        try {
            const q = "INSERT INTO posts(description, img, userId, createdAt) VALUES (@description, @img, @userId, GETDATE())";
            const values = {
                description: req.body.description,
                img: req.body.img,
                userId: userInfo.id
            };

            const pool = await mssql.connect(config);
            const request = pool.request();
            for (const param in values) {
                request.input(param, values[param]);
            }

            await request.query(q);
            return res.status(200).json("Post has been created.");
        } catch (error) {
            console.error('An error occurred:', error);
            return res.status(500).json({ error: error.message });
        }
    });
}

async function deletePost(req, res) {
    try {
        const token = req.session.accessToken;
        if (!token) return res.status(401).json("Not logged in!");

        const userInfo = jwt.verify(token, config.secret);

        const postId = req.params.id;
        const userId = userInfo.id;

        const pool = await mssql.connect(config);

        const deleteQuery = "DELETE FROM Posts WHERE id = @postId AND userId = @userId;";
        const deleteRequest = pool.request();
        deleteRequest.input("postId", mssql.Int, postId);
        deleteRequest.input("userId", mssql.Int, userId);
        await deleteRequest.query(deleteQuery);

        const checkQuery = "SELECT * FROM Posts WHERE id = @postId;";
        const checkRequest = pool.request();
        checkRequest.input("postId", mssql.Int, postId);
        const checkResult = await checkRequest.query(checkQuery);

        if (checkResult.recordset.length === 0) {
            return res.status(200).json("Post has been successfully deleted.");
        } else {
            return res.status(500).json("Failed to delete the post from the database.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ error: error.message });
    }
}


module.exports = { getPosts, addPost, deletePost };
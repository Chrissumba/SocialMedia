const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const moment = require('moment')
require('dotenv').config()
    // req.session.authorized = true;
    // req.session.user = user;
async function getPosts(req, res) {
    const userId = req.query.userId;
    const token = req.session.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    try {
        const userInfo = await jwt.verify(token, config.secret);
        const pool = await mssql.connect(config);

        const q = `
      SELECT DISTINCT p.*, u.id AS userId, u.name, u.profilePic
      FROM posts AS p
      JOIN users AS u ON u.id = p.userId
      LEFT JOIN Follow AS r ON p.userId = r.followedUserId
      WHERE r.followerUserId = @userId OR p.userId = @userId
      ORDER BY p.createdAt DESC;
    `;

        const request = pool.request();
        request.input("userId", mssql.Int, userId || userInfo.id);

        const result = await request.query(q);

        // Process the result to ensure userId is a single value, not an array
        const processedResult = result.recordset.map((post) => ({
            ...post,
            userId: Array.isArray(post.userId) ? post.userId[0] : post.userId,
        }));

        return res.status(200).json(processedResult);
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

async function getSinglePost(req, res) {
    const userId = req.query.userId;
    const postId = req.params.id;
    const token = req.session.accessToken;

    if (!token) {
        return res.status(401).json("Not logged in!");
    }

    try {
        const userInfo = await jwt.verify(token, config.secret);
        const pool = await mssql.connect(config);

        const q = `
        SELECT
            p.id AS post_id,
            p.description AS post_description,
            p.img AS post_image,
            u.username AS post_author,
            c.id AS comment_id,
            c.description AS comment_description,
            c.createdAt AS comment_created_at,
            uc.username AS comment_author,
            r.id AS reply_id,
            r.description AS reply_description,
            r.createdAt AS reply_created_at,
            ur.username AS reply_author
        FROM Posts p
        JOIN Users u ON p.userId = u.id
        JOIN Comments c ON c.postId = p.id
        JOIN Users uc ON c.userId = uc.id
        LEFT JOIN Replies r ON r.commentId = c.id
        LEFT JOIN Users ur ON r.personId = ur.id
        WHERE p.id = @postId;`;

        const request = pool.request();
        request.input("postId", mssql.Int, postId);

        const result = await request.query(q);
        return res.status(200).json(result.recordset);
    } catch (error) {
        return res.status(500).json(error);
    }
}



module.exports = { getPosts, addPost, deletePost, getSinglePost };
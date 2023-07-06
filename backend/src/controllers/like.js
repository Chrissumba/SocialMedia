const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const moment = require('moment')
require('dotenv').config()

async function getLikes(req, res) {
    try {
        const postId = req.query.postId;
        const pool = await mssql.connect(config);

        const result = await pool
            .request()
            .input('postId', mssql.Int, postId)
            .query('SELECT userId FROM Likes WHERE postId = @postId');

        const userIds = result.recordset.map((like) => like.userId);
        return res.status(200).json(userIds);
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json(error);
    }
};

async function addLike(req, res) {
    const token = req.session.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, config.secret, async(err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            const q = 'INSERT INTO Likes (userId, postId) VALUES (@userId, @postId)';
            const values = {
                userId: userInfo.id,
                postId: req.body.postId,
            };

            const pool = await mssql.connect(config);
            const request = new mssql.Request(pool);
            for (const param in values) {
                request.input(param, values[param]);
            }

            const insertResult = await request.query(q);
            if (insertResult.rowsAffected[0] === 0) {
                return res.status(500).json('Failed to create like.');
            }

            return res.status(200).json('Like has been created.');
        } catch (error) {
            console.error('An error occurred:', error);
            return res.status(500).json({ error: error.message });
        }
    });
}

async function deleteLike(req, res) {
    const token = req.session.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, config.secret, async(err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            const postId = req.params.postId;
            if (!postId) {
                return res.status(400).json('Missing postId parameter.');
            }

            const parsedPostId = parseInt(postId, 10);
            if (isNaN(parsedPostId)) {
                return res.status(400).json('Invalid postId parameter.');
            }

            const pool = await mssql.connect(config);

            const deleteQuery = `
          DELETE FROM Likes 
          WHERE userId = @userId AND postId = @postId
        `;
            const deleteResult = await pool
                .request()
                .input('userId', mssql.Int, userInfo.id)
                .input('postId', mssql.Int, parsedPostId)
                .query(deleteQuery);

            if (deleteResult.rowsAffected[0] === 0) {
                return res.status(404).json('Like not found.');
            }

            return res.status(200).json({ message: 'Like has been deleted.' });
        } catch (error) {
            console.error('An error occurred:', error);
            return res.status(500).json({ error: error.message });
        }
    });
}



module.exports = { getLikes, addLike, deleteLike };
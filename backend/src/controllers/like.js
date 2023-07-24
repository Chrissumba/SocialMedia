const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
require('dotenv').config()

async function getLikes(req, res) {
    try {
        const { postId } = req.params;
        const pool = await mssql.connect(config);

        const query = `
        SELECT userId
        FROM Likes
        WHERE postId = @postId;
      `;

        const request = pool.request();
        request.input('postId', mssql.Int, postId);

        const result = await request.query(query);

        const likes = result.recordset.map((row) => [row.userId]);

        if (likes.length === 0) {
            return res.status(200).json({ message: 'No likes found for the specified post.' });
        }

        return res.status(200).json(likes);
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ error: error.message });
    }
}



async function addLike(req, res) {
    const token = req.session.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, config.secret, async(err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            const userId = userInfo.id;
            const postId = req.body.postId;

            // Check if the user is the owner of the post
            const checkPostQuery = `
          SELECT userId
          FROM Posts
          WHERE id = @postId;
        `;

            const pool = await mssql.connect(config);
            const checkPostRequest = pool.request();
            checkPostRequest.input('postId', mssql.Int, postId);
            const checkPostResult = await checkPostRequest.query(checkPostQuery);
            const postUserId = checkPostResult.recordset[0].userId;

            // if (userId === postUserId) {
            //     return res.status(400).json('Cannot like your own post.');
            // }

            // Check if the user has already liked the post
            const checkLikeQuery = `
          SELECT COUNT(*) AS count
          FROM Likes
          WHERE userId = @userId
          AND postId = @postId;
        `;

            const insertQuery = `
          INSERT INTO Likes (userId, postId)
          VALUES (@userId, @postId);
        `;

            const checkRequest = pool.request();
            checkRequest.input('userId', mssql.Int, userId);
            checkRequest.input('postId', mssql.Int, postId);

            const checkResult = await checkRequest.query(checkLikeQuery);
            if (checkResult.recordset[0].count > 0) {
                return res.status(400).json('You have already liked this post.');
            }

            const insertRequest = pool.request();
            insertRequest.input('userId', mssql.Int, userId);
            insertRequest.input('postId', mssql.Int, postId);

            const insertResult = await insertRequest.query(insertQuery);
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
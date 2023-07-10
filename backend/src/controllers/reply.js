const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const moment = require('moment')
require('dotenv').config()



async function getReplies(req, res) {
    const { commentId } = req.params;
    const pool = await mssql.connect(config);
    try {
        const q = `
        SELECT U.name, R.description
        FROM Replies R
        JOIN Users U ON U.id = R.personId
        WHERE R.commentId = @commentId
        ORDER BY R.createdAt DESC;
      `;

        const request = pool.request();
        request.input('commentId', mssql.Int, commentId);

        const result = await request.query(q);
        const replies = result.recordset;

        if (replies.length === 0) {
            return res.status(200).json({ message: 'No replies found for the specified comment.' });
        }

        return res.status(200).json(replies);
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ error: error.message });
    }
}



async function addReply(req, res) {
    const token = req.session.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, config.secret, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        // const q = "INSERT INTO Replies(postId,commentId , description ,  personId ,  createdAt) VALUES (@postId,@commentId, @description, @ personId , GETDATE())";
        const q = "INSERT INTO Replies (postId, commentId, description, personId, createdAt) VALUES (@postId, @commentId, @description, @personId, GETDATE())";


        const values = {
            description: req.body.description,
            commentId: req.body.commentId,
            postId: req.body.postId,
            personId: userInfo.id

        };

        const pool = new mssql.ConnectionPool(config);
        pool.connect().then(() => {
            const request = new mssql.Request(pool);
            for (const param in values) {
                request.input(param, values[param]);
            }
            request.query(q)
                .then(() => {
                    return res.status(200).json("Reply has been created.");
                })
                .catch((err) => {
                    return res.status(500).json(err);
                })
                .finally(() => {
                    pool.close();
                });
        }).catch((err) => {
            return res.status(500).json(err);
        });
    });
}



module.exports = { getReplies, addReply };
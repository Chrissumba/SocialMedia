const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const moment = require('moment')
require('dotenv').config()



async function getReplies(req, res) {
    const { commentId } = req.params;

    const q = `
      SELECT U.name, R.description
      FROM Replies R
      JOIN Users U ON U.id = R.personId
      WHERE R.commentId = @commentId
      ORDER BY R.createdAt DESC;
    `;

    const pool = new mssql.ConnectionPool(config);
    pool.connect().then(() => {
        const request = new mssql.Request(pool);
        request.input("commentId", mssql.Int, commentId);
        request.query(q)
            .then((result) => {
                return res.status(200).json(result.recordset);
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
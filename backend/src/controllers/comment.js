const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const moment = require('moment')
require('dotenv').config()



async function getComments(req, res) {

    const q = `
    SELECT c.*, u.id AS userId, name, profilePic 
    FROM Comments AS c 
    JOIN Users AS u ON u.id = c.userId
    WHERE c.postId = @postId
    ORDER BY c.createdAt DESC
    `;

    const pool = new mssql.ConnectionPool(config);
    pool.connect().then(() => {
        const request = new mssql.Request(pool);
        request.input('postId', req.query.postId);
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

async function addComment(req, res) {
    const token = req.session.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, config.secret, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO Comments(description, createdAt, userId, postId) VALUES (@description, GETDATE(), @userId, @postId)";

        const values = {
            description: req.body.description,
            postId: req.body.postId,
            userId: userInfo.id
        };

        const pool = new mssql.ConnectionPool(config);
        pool.connect().then(() => {
            const request = new mssql.Request(pool);
            for (const param in values) {
                request.input(param, values[param]);
            }
            request.query(q)
                .then(() => {
                    return res.status(200).json("Comment has been created.");
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

async function deleteComment(req, res) {
    const token = req.session.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, config.secret, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const commentId = req.params.id;
        const q = "DELETE FROM Comments WHERE id = id AND userId = @userId";

        const pool = new mssql.ConnectionPool(config);
        pool.connect().then(() => {
            const request = new mssql.Request(pool);
            request.input("id", req.params.id);
            request.input("userId", userInfo.id);
            request.query(q)
                .then((result) => {
                    if (result.rowsAffected[0] > 0) {
                        return res.status(200).json("Comment has been deleted.");
                    } else {
                        return res.status(403).json("You can only delete your comment.");
                    }
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


module.exports = { getComments, addComment, deleteComment };
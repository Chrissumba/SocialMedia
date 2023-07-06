const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const moment = require('moment')
require('dotenv').config()

async function getFollow(req, res) {
    try {
        const followedUserId = req.params.userId;
        const pool = await mssql.connect(config);

        const result = await pool
            .request()
            .input('followedUserId', mssql.Int, followedUserId)
            .query(`
            SELECT id, username, email, name, coverPic, profilePic, city, website
            FROM Users
            WHERE id IN (
              SELECT followerUserId
              FROM Follow
              WHERE followedUserId = @followedUserId
            )
          `);

        const users = result.recordset;
        return res.status(200).json(users);
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json(error);
    }
}



async function addFollow(req, res) {
    const token = req.session.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    try {
        const userInfo = jwt.verify(token, config.secret);
        const followerUserId = userInfo.id;
        const followedUserId = req.body.followedUserId;

        const checkQuery = `
        SELECT COUNT(*) AS count
        FROM Follow
        WHERE followerUserId = @followerUserId
        AND followedUserId = @followedUserId;
      `;

        const insertQuery = `
        INSERT INTO Follow (followerUserId, followedUserId)
        VALUES (@followerUserId, @followedUserId);
      `;

        const pool = await mssql.connect(config);
        const checkRequest = pool.request();
        checkRequest.input('followerUserId', mssql.Int, followerUserId);
        checkRequest.input('followedUserId', mssql.Int, followedUserId);

        const checkResult = await checkRequest.query(checkQuery);
        if (checkResult.recordset[0].count > 0) {
            return res.status(400).json('Already following this user.');
        }

        const insertRequest = pool.request();
        insertRequest.input('followerUserId', mssql.Int, followerUserId);
        insertRequest.input('followedUserId', mssql.Int, followedUserId);

        const insertResult = await insertRequest.query(insertQuery);
        if (insertResult.rowsAffected[0] === 0) {
            return res.status(500).json('Failed to create follow.');
        }

        return res.status(200).json('Follow has been created.');
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function deleteFollow(req, res) {
    try {
        const token = req.session.accessToken;
        if (!token) {
            return res.status(401).json('Not logged in!');
        }

        const userInfo = jwt.verify(token, config.secret);
        const followerUserId = userInfo.id;
        const followedUserId = req.body.followedUserId;

        const deleteQuery = `
        DELETE FROM Follow
        WHERE followerUserId = @followerUserId
        AND followedUserId = @followedUserId;
      `;

        const pool = await mssql.connect(config);
        const request = new mssql.Request(pool);
        request.input('followerUserId', mssql.Int, followerUserId);
        request.input('followedUserId', mssql.Int, followedUserId);

        const deleteResult = await request.query(deleteQuery);
        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json('Follow not found.');
        }

        return res.status(200).json({ message: 'Follow has been deleted.' });
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getFollow, addFollow, deleteFollow };
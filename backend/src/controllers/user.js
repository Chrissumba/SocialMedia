const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const bcrypt = require('bcrypt');
const moment = require('moment')
require('dotenv').config()



async function getUser(req, res) {
    const userId = req.params.userId;

    try {
        const pool = await mssql.connect(config);

        const query = `
        SELECT * 
        FROM Users 
        WHERE id = @userId
      `;

        const result = await pool
            .request()
            .input("userId", mssql.Int, userId)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json("User not found.");
        }

        const userInfo = result.recordset[0];
        const { password, ...info } = userInfo;

        return res.json(info);
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ error: error.message });
    }
}


async function updateUser(req, res) {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, config.secret, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const userIdToUpdate = parseInt(req.params.userId);
        const userIdFromToken = userInfo.id;

        // Check if the user ID from the token matches the user ID being updated
        if (userIdToUpdate !== userIdFromToken) {
            return res.status(403).json("Unauthorized to update user information");
        }

        const q = `
        UPDATE Users
        SET name = @name, city = @city, website = @website, profilePic = @profilePic, coverPic = @coverPic, password = @password
        WHERE id = @id;
      `;

        const values = {
            name: req.body.name,
            city: req.body.city,
            website: req.body.website,
            coverPic: req.body.coverPic,
            profilePic: req.body.profilePic,
            password: req.body.password, // Plain-text password from the request body
            id: userIdToUpdate, // Use the user ID being updated
        };

        mssql.connect(config)
            .then((pool) => {
                const request = pool.request();
                for (const param in values) {
                    if (param === 'password') {
                        // Hash the password before storing it in the database
                        const hashedPassword = bcrypt.hashSync(values[param], 10);
                        request.input(param, mssql.NVarChar, hashedPassword);
                    } else {
                        request.input(param, values[param]);
                    }
                }
                request.query(q, (err, data) => {
                    if (err) {
                        console.error('An error occurred:', err);
                        return res.status(500).json(err);
                    }
                    if (data.rowsAffected.length > 0) {
                        return res.status(200).json("User information has been updated");
                    } else {
                        return res.status(404).json("User not found");
                    }
                });
            })
            .catch((err) => {
                console.error('An error occurred:', err);
                return res.status(500).json(err);
            });
    });
}

async function getUserByName(req, res) {
    const name = req.params.name;

    try {
        const pool = await mssql.connect(config);

        const query = `
        SELECT * 
        FROM Users 
        WHERE name = @name
      `;

        const result = await pool
            .request()
            .input("name", mssql.VarChar, name)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json("User not found.");
        }

        const userInfo = result.recordset[0];
        const { password, ...info } = userInfo;

        return res.json(info);
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ error: error.message });
    }
}


module.exports = { getUser, updateUser, getUserByName };
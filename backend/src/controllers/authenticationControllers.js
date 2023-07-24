const bcrypt = require('bcrypt')
const mssql = require('mssql')
const jwt = require('jsonwebtoken')
const { user } = require('../config/config')
const config = require('../config/config')
const createMarkup = require("../utils/createMarkup");
const sendMail = require('../utils/sendMail')
require('dotenv').config()


const { tokenGenerator } = require('../utils/token')


//Function to register a new member
async function register(req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    try {
        const pool = await mssql.connect(config);

        const query = 'SELECT * FROM Users WHERE username = @username';
        const request = pool.request();
        request.input('username', mssql.VarChar, username);

        const result = await request.query(query);

        if (result.recordset.length > 0) {
            return res.status(409).json('There already exists a user with that username,try using a different user name');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
        INSERT INTO users (username, email, password, name)
        VALUES (@username, @email, @password, @name);
      `;

        const insertRequest = pool.request();
        insertRequest.input('username', mssql.VarChar, username);
        insertRequest.input('email', mssql.VarChar, email);
        insertRequest.input('password', mssql.VarChar, hashedPassword);
        insertRequest.input('name', mssql.VarChar, name);

        const insertResult = await insertRequest.query(insertQuery);

        if (insertResult.rowsAffected[0] > 0) {
            // Templating
            const html = await createMarkup('./src/views/signup.ejs', {
                name: username,
                text: "At our social media platform, you'll find a wide range of things in various genres, from stories to pictures. Feel free to explore the social media platform, find your next favorite person, and enjoy the friendship journey. If you have any questions or need assistance, don't hesitate to reach out to our friendly staff.",
            });

            const message = {
                to: email,
                from: process.env.EMAIL_USER,
                subject: 'Hello from Sumba\'s Social Media',
                html: html,
            };

            await sendMail(message);
            console.log(insertResult);

            return res.status(201).json({
                success: true,
                message: 'User has been created',
                data: insertResult.recordset,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'No rows affected',
            });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
            error: error.message,
        });
    }
}


async function login(req, res) {
    try {
        const { username, password } = req.body;
        const pool = await mssql.connect(config);

        const result = await pool
            .request()
            .input("username", mssql.VarChar, username)
            .query("SELECT * FROM Users WHERE username = @username");

        if (result.recordset.length === 0) {
            return res.status(404).json("User not found!");
        }

        const user = result.recordset[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json("Wrong password or username!");
        }

        const token = jwt.sign({ id: user.id }, config.secret);

        const { password: hashedPassword, ...userData } = user;

        req.session.accessToken = token; // Store the token in the session
        // req.session.authorized = true;
        //         req.session.user = user;


        // res.status(200).json(userData);
        res.cookie("accessToken", token, {
            httpOnly: true,
        });

        // Send the response with the user data (others) and the access token as a cookie
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "An error occurred",
            error: error.message,
        });
    }
}


async function logout(req, res) {
    req.session.destroy(); // Destroy the session
    res.status(200).json("You have successfully logged out.");
}

module.exports = { register, login, logout }
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
    try {
        let sql = await mssql.connect(config);

        if (sql.connected) {
            const { username, email, password, name, } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            let request = sql
                .request()
                .input("username", mssql.VarChar, username)
                .input("email", mssql.VarChar, email)
                .input("password", mssql.VarChar, hashedPassword)
                .input("name", mssql.VarChar, name);


            let result = await request.execute("InsertUser");

            if (result.rowsAffected[0] > 0) {
                // Templating
                let html = await createMarkup("./src/views/signup.ejs", {
                    name: username,
                    text: "At our social media platform, you'll find a wide range of things in various genres, from stories to pictures.Feel free to explore the social media platform, find your next favorite person, and enjoy the friendship journey.If you have any questions or need assistance, don't hesitate to reach out to our friendly staff.",
                });

                const message = {
                    to: email,
                    from: process.env.EMAIL_USER,
                    subject: "Hello from Sumba's Social Media",
                    html: html,
                };

                await sendMail(message);
                console.log(result);

                res.status(201).send({
                    success: true,
                    message: "user has been created",
                    data: result.recordset, // Include the recordset data in the response
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: "No rows affected",
                });
            }
        } else {
            res.status(500).send({
                success: false,
                message: "Database connection failed",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "An error occurred",
            error: error.message, // Include the error message in the response
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
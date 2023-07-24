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
        const token = req.session.accessToken;
        if (!token) return res.status(401).json("Not logged in!");

        const userTokenInfo = await jwt.verify(token, config.secret); // Rename the variable to userTokenInfo

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
    const token = req.session.accessToken;
    if (!token) return res.status(401).json({ message: "Not authenticated!" });

    jwt.verify(token, config.secret, async(err, userInfo) => {
                if (err) return res.status(403).json({ message: "Token is not valid!" });

                const userIdToUpdate = parseInt(req.params.userId);
                const userIdFromToken = userInfo.id;

                // Check if the user ID from the token matches the user ID being updated
                if (userIdToUpdate !== userIdFromToken) {
                    return res
                        .status(403)
                        .json({ message: "Unauthorized to update user information" });
                }

                const fieldsToUpdate = ["name", "city", "website", "coverPic", "profilePic", "password"];

                const updates = {};
                for (const field of fieldsToUpdate) {
                    if (req.body[field] !== undefined) {
                        if (field === "password") {
                            // Hash the password before storing it in the updates object
                            const saltRounds = 10;
                            const salt = await bcrypt.genSalt(saltRounds);
                            const hashedPassword = await bcrypt.hash(req.body[field], salt);
                            updates[field] = hashedPassword;
                        } else {
                            updates[field] = req.body[field];
                        }
                    }
                }

                if (Object.keys(updates).length === 0) {
                    // No fields to update were provided in the request
                    return res.status(400).json({ message: "No fields to update" });
                }

                const q = `
        UPDATE Users
        SET ${Object.keys(updates).map((field) => `${field} = @${field}`).join(", ")}
        WHERE id = @id;
      `;
  
      try {
        const pool = await mssql.connect(config);
        const request = pool.request();
        for (const [field, value] of Object.entries(updates)) {
          request.input(field, value);
        }
        request.input("id", userIdToUpdate);
        const result = await request.query(q);
        if (result.rowsAffected.length > 0) {
          return res
            .status(200)
            .json({ message: "User information has been updated" });
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
  }
// async function getUserByName(req, res) {
//     try {
//         const token = req.session.accessToken;
//         if (!token) return res.status(401).json("Not logged in!");

//         const userTokenInfo = await jwt.verify(token, config.secret); // Rename the variable to userTokenInfo
//         const name = req.params.name;

//         const pool = await mssql.connect(config);
//         const query = `
//         SELECT * 
//         FROM Users 
//         WHERE name = @name
//       `;

//         const result = await pool
//             .request()
//             .input("name", mssql.VarChar, name)
//             .query(query);

//         if (result.recordset.length === 0) {
//             return res.status(404).json("User not found.");
//         }

//         const user = result.recordset[0];
//         const { password, ...info } = user;

//         return res.json(info);
//     } catch (error) {
//         console.error("An error occurred:", error);
//         return res.status(500).json({ error: error.message });
//     }
// }
async function getUserByName(req, res) {
  try {
      const token = req.session.accessToken;
      if (!token) return res.status(401).json("Not logged in!");

      const userTokenInfo = await jwt.verify(token, config.secret); // Rename the variable to userTokenInfo
      const searchLetters = req.params.name; // Letters entered by the user for partial search

      const pool = await mssql.connect(config);
      const query = `
          SELECT * 
          FROM Users 
          WHERE name LIKE '%' + @searchLetters + '%'
      `;

      const result = await pool
          .request()
          .input("searchLetters", mssql.VarChar, searchLetters)
          .query(query);

      if (result.recordset.length === 0) {
          return res.status(404).json("User not found.");
      }

      // Extracting user information and removing the password field
      const users = result.recordset.map(user => {
          const { password, ...info } = user;
          return info;
      });

      return res.json(users);
  } catch (error) {
      console.error("An error occurred:", error);
      return res.status(500).json({ error: error.message });
  }
}




module.exports = { getUser, updateUser, getUserByName };
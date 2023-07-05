const transporter = require('../config/emailConfiguration');

async function sendMail(message) {
    try {
        let result = await transporter.sendMail(message);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;
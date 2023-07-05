require('dotenv').config()



const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    secret: process.env.SECRET,
    database: process.env.DB_NAME,
    server: 'localhost',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

module.exports = config;
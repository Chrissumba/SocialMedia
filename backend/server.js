const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const { v4 } = require("uuid");
require('dotenv').config();

const app = express();
const oneDay = 1000 * 60 * 60 * 24;

app.use(cors({
    origin: 'http://localhost:3001', // Replace with the URL of your React app
    credentials: true, // Allow credentials (cookies)
}));

app.use(express.json());
// app.use(session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: oneDay,
//         httpOnly: true,
//         secure: false
//     }
// }));
app.use(session({

    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    unset: "destroy",
    genid: () => v4(),
    cookie: {
        maxAge: oneDay,
        httpOnly: true,
        secure: false,
        domain: "localhost"
    }
}))



// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, "../client/public/upload");
//     },
//     filename: function(req, file, cb) {
//         cb(null, Date.now() + file.originalname);
//     },
// });
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "../client/public/upload");
    },
    filename: function(req, file, cb) {
        // Generate a random string to make the filename unique
        const randomString = Math.random().toString(36).substring(7);
        // Get the original file extension
        const fileExtension = file.originalname.split(".").pop();
        // Combine the random string and file extension to create the new filename
        const newFileName = `${Date.now()}-${randomString}.${fileExtension}`;
        cb(null, newFileName);
    },
});


const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    res.status(200).json(file.filename);
});



app.set("view engine", "ejs");
const authenticationRouter = require('./src/routes/authentication');
const postrouter = require('./src/routes/posts');
const commentsrouter = require('./src/routes/comments');
const likesrouter = require('./src/routes/likes');
const userrouter = require('./src/routes/users');
const followrouter = require('./src/routes/follows');
const storyrouter = require('./src/routes/stories');
const notificationrouter = require('./src/routes/notifications');
const replyrouter = require('./src/routes/replies');
const recommendationrouter = require('./src/routes/recommendat')
app.get('/', (req, res) => {
    res.send("Hello, Welcome.")
});

app.use(authenticationRouter);
app.use(postrouter);
app.use(commentsrouter);
app.use(likesrouter);
app.use(userrouter);
app.use(followrouter);
app.use(storyrouter);
app.use(notificationrouter);
app.use(replyrouter);
app.use(recommendationrouter)

const { deleteExpiredStories } = require('../backend/src/controllers/story');
cron.schedule('* * * * *', () => {
    deleteExpiredStories();
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
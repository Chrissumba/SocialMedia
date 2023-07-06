const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const session = require('express-session')

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");


const authenticationRouter = require('./src/routes/authentication');
const postrouter = require('./src/routes/posts');
const commentsrouter = require('./src/routes/comments');
const likesrouter = require('./src/routes/likes');
const userrouter = require('./src/routes/users');
const followrouter = require('./src/routes/follows');
const storyrouter = require('./src/routes/stories');
const notificationrouter = require('./src/routes/notifications')
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello, Welcome.")
})

app.use(authenticationRouter);
app.use(postrouter);
app.use(commentsrouter);
app.use(likesrouter);
app.use(userrouter);
app.use(followrouter);
app.use(storyrouter);
app.use(notificationrouter)

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is loading ${port}`)
});
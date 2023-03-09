require(`dotenv`).config();
const express = require(`express`);
const userRouter = require(`./app/routes/user`);
const postRouter = require(`./app/routes/post`);
const { tokenCleanup, } = require('./app/helper');
const { CLEANUPINTERVAL, } = require('./config');
const { sendResponse, } = require('./app/util/sendResponse');
const { NonExistentEndpoint, } = require('./app/util/messages');

const app = express();
app.use(express.json());

app.use(`/user`, userRouter);
app.use(`/post`, postRouter);

app.all(`*`, (req) => {
    sendResponse(req.res, {
        statusCode: 404,
        message: NonExistentEndpoint,
    });
}, (err, req, res, next) => {
    sendResponse(res, {
        statusCode: 500,
        message: err.message,
    });
});

// needed in case a user logged in and never logged out;
// removes unnecessary keys from the database
setInterval(tokenCleanup, CLEANUPINTERVAL);

app.listen(process.env.PORT, () => {
    console.log(`Successfully started server on port ${process.env.PORT}`);
});

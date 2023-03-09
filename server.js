require(`dotenv`).config();
const express = require(`express`);
const userRouter = require(`./app/routes/user`);
const postRouter = require(`./app/routes/post`);
const { tokenCleanup, } = require('./app/helper/tokenCleanup');
const { CLEANUPINTERVAL, } = require('./config');

const app = express();
app.use(express.json());

app.use(`/user`, userRouter);
app.use(`/post`, postRouter);

// needed in case a user logged in and never logged out;
// removes unnecessary keys from the database
setInterval(tokenCleanup, CLEANUPINTERVAL);

app.listen(process.env.PORT, () => {
    console.log(`Successfully started server on port ${process.env.PORT}`);
});

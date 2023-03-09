require(`dotenv`).config();
const express = require(`express`);
const userRouter = require(`./app/routes/user`);
const postRouter = require(`./app/routes/post`);

const app = express();
app.use(express.json());

app.use(`/user`, userRouter);
app.use(`/post`, postRouter);

app.listen(process.env.PORT, () => {
    console.log(`Successfully started server on port ${process.env.PORT}`);
});


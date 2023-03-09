require(`dotenv`).config();
const express = require(`express`);
const userRouter = require(`./app/routes/user`);

const app = express();
app.use(express.json());

app.use(`/user`, userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Successfully started server on port ${process.env.PORT}`);
});


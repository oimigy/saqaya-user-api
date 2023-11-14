import express from "express";
import userRouter from "./routes/user/user.router.js";

const app = express();
const port = 5000;

app.use(express.json());
app.use("/user", userRouter);

app.listen(port, () => console.log(`App is running on port ${port}...`));

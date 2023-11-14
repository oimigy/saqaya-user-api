import express from "express";
import userRouter from "./routes/user/user.router.js";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);

app.listen(port, () => console.log(`App is running on port ${port}...`));

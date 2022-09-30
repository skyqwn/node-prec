import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
dotenv.config();

import globalRouter from "./routes/globalRouter.js";
import userRouter from "./routes/userRouter.js";
import memoryRouter from "./routes/memoryRouter.js";

const app = express();
const port = process.env.PORT;

app.set("view engine", "pug");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  res.render("home");
});

const errorHandler = () => {
  console.log("❌연결을 실패하였습니다.");
};

const successHandler = () => {
  console.log("✅연결을 성공하였습니다.");
};

const db = mongoose.connection;
db.on("error", errorHandler);
db.once("open", successHandler);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/memory", memoryRouter);

app.listen(port, () => {
  console.log(`서버가 ${port}에서 실행중입니다.`);
});

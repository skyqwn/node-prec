import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import sessions from "express-session";
import MongoStore from "connect-mongo";
dotenv.config();

import globalRouter from "./routes/globalRouter.js";
import userRouter from "./routes/userRouter.js";
import memoryRouter from "./routes/memoryRouter.js";
import { localSetMiddleware } from "./middleware.js";

const app = express();
const port = process.env.PORT;

app.set("trust proxy", 1); // trust first proxy

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

app.set("view engine", "pug");
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));

const errorHandler = () => {
  console.log("❌연결을 실패하였습니다.");
};

const successHandler = () => {
  console.log("✅연결을 성공하였습니다.");
};

const db = mongoose.connection;
db.on("error", errorHandler);
db.once("open", successHandler);

const cspOptions = {
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),

    "script-src": ["'self'"],

    "img-src": ["'self'", "blob:"],
  },
};

app.use(
  helmet({
    contentSecurityPolicy: cspOptions,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  sessions({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

app.use(localSetMiddleware);

app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/memory", memoryRouter);

app.use((err, req, res, next) => {
  console.log(err);
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "알수 없는 오류가 발생했습니다.";
  // return res.status(errorStatus).json({ message: errorMessage });
  return res.render("error", { errorStatus, errorMessage });
});

app.listen(port, () => {
  console.log(`서버가 ${port}에서 실행중입니다.`);
});

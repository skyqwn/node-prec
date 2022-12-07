import express from "express";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import sessions from "express-session";
import MongoStore from "connect-mongo";
// import csrf from "csurf";
import flash from "connect-flash";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import globalRouter from "./routes/globalRouter.js";
import userRouter from "./routes/userRouter.js";
import memoryRouter from "./routes/memoryRouter.js";
import { localSetMiddleware } from "./middleware.js";

const app = express();
const port = process.env.PORT || 3000;
// const csrfProtection = csrf();

let mongoUrl;

if (process.env.NODE_ENV === "production") {
  mongoUrl = process.env.PROD_MONGO_URL;
} else {
  mongoUrl = process.env.DEV_MONGO_URL;
}

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
});
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));
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

    "img-src": [
      "'self'",
      "blob:",
      "https://memory-node.s3.ap-northeast-2.amazonaws.com",
    ],
  },
};

app.use(
  helmet({
    contentSecurityPolicy: cspOptions,
  })
);
if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  sessions({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl,
    }),
  })
);
// app.use(csrfProtection);
app.use(flash());

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

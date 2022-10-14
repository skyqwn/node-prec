import express from "express";

import {
  home,
  join,
  joinPost,
  login,
  loginPost,
  logout,
} from "../controllers/globalController.js";

const globalRouter = express.Router();

globalRouter.get("/", home);

globalRouter.route("/join").get(join).post(joinPost);

globalRouter.route("/login").get(login).post(loginPost);

globalRouter.route("/logout").get(logout);

export default globalRouter;

//조인 로그인 로그아웃

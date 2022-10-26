import express from "express";

import {
  home,
  join,
  joinPost,
  login,
  loginPost,
  logout,
  postResetPassword,
  resetPassword,
  meUpdate,
  me,
  meUpdatePost,
  loginVerify,
} from "../controllers/globalController.js";
import { avatarMulter, isVerifiedEmail } from "../middleware.js";

const globalRouter = express.Router();

globalRouter.get("/", home);

globalRouter.route("/join").get(join).post(joinPost);

globalRouter.route("/login").get(login).post(loginPost);

globalRouter.route("/logout").get(logout);

globalRouter.get("/passwordreset", isVerifiedEmail, resetPassword);

globalRouter.post("/passwordreset", isVerifiedEmail, postResetPassword);

globalRouter.get("/me", isVerifiedEmail, me);

globalRouter.get("/me/update", isVerifiedEmail, meUpdate);
globalRouter.post(
  "/me/update",
  isVerifiedEmail,
  avatarMulter.single("file"),
  meUpdatePost
);

globalRouter.get("/verify", loginVerify);

export default globalRouter;

//조인 로그인 로그아웃

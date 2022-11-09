import express from "express";
import { check, body } from "express-validator";

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
import { S3MulterUpload } from "../middleware.js";

const globalRouter = express.Router();

globalRouter.get("/", home);

globalRouter.get("/join", join);

globalRouter.post(
  "/join",
  [
    body("email")
      .isEmail()
      .withMessage("유효한 이메일을 입력해주세요")
      .normalizeEmail(),
    body("password", "비밀번호는 최소 5글자 이상으로 입력바랍니다.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("passwordVerify")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("패스워드가 일치하지 않습니다.");
        }
        return true;
      }),
  ],
  joinPost
);

globalRouter.get("/login", login);

globalRouter.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password", "패스워드가 너무짧아요.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  loginPost
);

globalRouter.route("/logout").get(logout);

globalRouter.get("/passwordreset", resetPassword);

globalRouter.post("/passwordreset", postResetPassword);

globalRouter.get("/me", me);

globalRouter.get("/me/update", meUpdate);
globalRouter.post("/me/update", S3MulterUpload.single("file"), meUpdatePost);

globalRouter.get("/verify", loginVerify);

export default globalRouter;

//조인 로그인 로그아웃

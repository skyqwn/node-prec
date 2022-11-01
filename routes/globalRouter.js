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
import { avatarMulter, isVerifiedEmail } from "../middleware.js";

const globalRouter = express.Router();

globalRouter.get("/", home);

globalRouter.get("/join", join);

globalRouter.post(
  "/join",
  [
    check("email")
      .isEmail()
      .withMessage("유효한 이메일을 입력해주세요")
      .custom((value, { req }) => {
        if (value === "test@test.com") {
          throw new Error("이 이메일 주소는 존재하지 않습니다.");
        }
        return true;
      }),
    body("password", "비밀번호는 최소 5글자 이상으로 입력바랍니다.")
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("passwordVerify").custom((value, { req }) => {
      if (value === req.body.password) {
        throw new Error("패스워드가 일치하지 않습니다.");
      }
      return true;
    }),
  ],
  joinPost
);

globalRouter.get("/login", login);

globalRouter.post("/login", loginPost);

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

import crypto from "crypto";
import Memory from "../model/Memory.js";
import User from "../model/User.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import deletePassword from "../util/deletePassword.js";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
dotenv.config();
import { validationResult } from "express-validator";

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

export const home = async (req, res, next) => {
  try {
    const memories = await Memory.find().populate("creator");
    return res.render("home", { memories });
  } catch (error) {
    next(error);
  }
};

export const login = (req, res, next) => {
  res.render("login", {
    oldInput: {
      email: "",
      bodypassword: "",
    },
    validationErrors: [],
  });
};
export const join = (req, res) => {
  res.render("join", {
    oldInput: {
      name: "",
      email: "",
      bodypassword: "",
      passwordVerify: "",
    },
    validationErrors: [],
  });
};

export const joinPost = async (req, res, next) => {
  const {
    body: { name, email, password: bodypassword, passwordVerify },
  } = req;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("join", {
        errorMessage: errors.array()[0].msg,
        oldInput: { name, email, bodypassword, passwordVerify },
        validationErrors: errors.array(),
      });
    }

    if (bodypassword !== passwordVerify) {
      req.flash("error", "비밀번호가 같지 않습니다.");
      return res.redirect("/join");
    }
    const existUser = await User.exists({ email });

    if (existUser) {
      return res.status(422).render("join", {
        errorMessage: "이미 사용중인 이메일입니다",
        oldInput: { name, email, bodypassword, passwordVerify },
        validationErrors: errors.array(),
      });
    }

    const hashedPassword = bcrypt.hashSync(bodypassword, +process.env.BCRYPT);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const noPwUser = deletePassword(newUser);
    req.session.user = noPwUser;
    req.flash("success", "회원가입성공!");

    await transporter.sendMail({
      to: email,
      from: "love_kimba@naver.com",
      subject: "이메일 인증입니다.",
      html: `<h1>링크를 클릭해야 회원가입이 완료됩니다.</h1>
      <p>링크를 클릭하세요<a href="http://localhost:3000/verify?key=${newUser.emailVerifyString}">링크</a></p>
      `,
    });
    req.flash("success", "가입성공");
    res.redirect("login");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const loginPost = async (req, res, next) => {
  const errors = validationResult(req);
  const {
    body: { email, password: bodypassword }, //
  } = req;
  try {
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("login", {
        errorMessage: errors.array()[0].msg,
        oldInput: { email, bodypassword },
        validationErrors: errors.array(),
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).render("login", {
        errorMessage: "등록된 이메일이 아닙니다.",
        oldInput: { email, bodypassword },
        validationErrors: [{ param: "email", param: "password" }],
      });
    }
    const checkPassword = bcrypt.compareSync(bodypassword, user.password);
    if (!checkPassword) {
      return res.status(422).render("login", {
        errorMessage: "비밀번호가 맞지않습니다.",
        oldInput: { email, bodypassword },
        validationErrors: [{ param: "email", param: "password" }],
      });
    }

    const noPwUser = deletePassword(user);
    req.session.user = noPwUser;
    req.flash("success", `안녕하세요 ${user.name}님`);

    res.redirect("/me");
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  req.flash("success", "로그아웃 하셨습니다.");
  return res.redirect("/");
};

export const resetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("passwordreset", {
    titleName: "비밀번호 변경",
    errorMessage: message,
  });
};

export const postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/passwordreset");
    }
    const token = buffer.toString("hex");
    const {
      body: { email },
    } = req;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        req.flash("error", "등록된 이메일을 찾을 수 없습니다.");
        return res.redirect("/passwordreset");
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();

      res.redirect("/");
      return transporter.sendMail({
        to: email,
        from: "love_kimba@naver.com",
        subject: "비밀번호를 변경해주세요",
        html: `
          <p>비밀번호 변경<p>
          <p>이곳을 클립하세요 <a href="http://localhost:3000/passwordreset/${token}">link</a> 새로운 비밀번호를 설정할 수 있습니다<p>
        `,
      });
    } catch (error) {
      console.log(error);
    }
  });
};

export const getNewPassword = async (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("new-password", {
    titleName: "비밀번호 변경",
    errorMessage: message,
  });
};

export const me = (req, res, next) => {
  res.render("me");
};

export const meUpdate = (req, res, next) => {
  res.render("meUpdate");
};

export const meUpdatePost = async (req, res, next) => {
  const {
    user,
    body: { name },
    file,
  } = req;
  try {
    const updateUser = await User.findByIdAndUpdate(
      user._id,
      {
        name,
        file: file?.path,
      },
      { new: true }
    );

    const noPwUser = deletePassword(updateUser);
    req.session.user = noPwUser;

    return res.redirect("/me");
  } catch (error) {
    next(error);
  }
  // res.render("meUpdate");
};

export const loginVerify = async (req, res, next) => {
  const {
    query: { key },
    user,
  } = req;
  try {
    const newUser = await User.findById(user._id);
    if (newUser.emailVerifyString === key) {
      newUser.emailVerify = true;
      await newUser.save();

      const noPwUser = deletePassword(newUser);
      req.session.user = noPwUser;
      req.flash("success", `${newUser.name}님의 이일 인증 성공`);
      return res.redirect("/");
    } else {
      console.log("인증에 실패하였습니다.");
    }
  } catch (error) {
    next(error);
  }
};

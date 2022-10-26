import crypto from "crypto";

import User from "../model/User.js";
import Memory from "../model/Memory.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import createError from "../util/createError.js";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
dotenv.config();

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

export const home = (req, res) => {
  req.flash("success", "test");
  return res.render("home", {
    isLogin: req.session.isLogin,
    name: req.session.user,
  });
};
export const login = (req, res, next) => {
  res.render("login");
};
export const join = (req, res) => {
  res.render("join");
};

export const joinPost = async (req, res, next) => {
  const {
    body: { name, email, password: bodypassword, passwordVerify },
  } = req;
  try {
    if (bodypassword !== passwordVerify) {
      req.flash("error", "비밀번호가 같지 않습니다.");
      return res.redirect("/join");
      // return next(createError(400, "비밀번호가 같지 않습니다."));
    }
    const existUser = await User.exists({ email }); // await을 꼭 붙여야하는가?

    if (existUser) {
      req.flash("error", "이미 사용중인 이메일입니다.");
      return res.redirect("/join");
      // return next(createError(400, "이미 등록된 이메일입니다."));
    }

    const hashedPassword = bcrypt.hashSync(bodypassword, +process.env.BCRYPT);
    // console.log(hashedPassword);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const userInfo = { ...newUser._doc }; //콘솔을 찍어도 안남옴 ㅜ
    const { password, ...otherInfo } = userInfo;

    req.session.user = otherInfo;
    await newUser.save();

    req.flash("success", "로그인성공");
    res.render("login");

    return transporter.sendMail({
      to: email,
      from: "love_kimba@naver.com",
      subject: "이메일 인증입니다.",
      html: `<h1>링크를 클릭해야 회원가입이 완료됩니다.</h1>
      <p>링크를 클릭하세요<a href="http://localhost:3000/verify?key=${newUser.emailVerifyString}">링크</a></p>
      `,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const loginPost = async (req, res, next) => {
  const {
    body: { email, password: bodypassword }, //
  } = req;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "등록된 이메일이 아닙니다.");
      return res.redirect("/login");
      // return next(createError(400, "등록된 이메일이 없습니다."));
    }
    const checkPassword = bcrypt.compareSync(bodypassword, user.password);
    if (!checkPassword) {
      req.flash("error", "비밀번호를 다시 확인해주세요.");
      return res.redirect("/login");
    }

    const userInfo = { ...user._doc }; //콘솔을 찍어도 안남옴 ㅜ
    const { password, ...otherInfo } = userInfo;

    req.session.user = otherInfo;
    req.session.isLogin = true;

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
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
    const userInfo = { ...updateUser._doc };

    const { password, ...otherInfo } = userInfo;

    req.session.user = otherInfo;
    req.session.isLogin = true;

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

      const userInfo = { ...newUser._doc };

      const { password, ...otherInfo } = userInfo;

      req.session.user = otherInfo;
      req.session.isLogin = true;

      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      req.flash("success", "이메일인증성공!");
      res.redirect("/");
    } else {
      console.log("인증이 되지 않았습니다.");
    }
  } catch (error) {
    next(error);
  }
};

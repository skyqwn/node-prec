import User from "../model/User.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import createError from "../util/createError.js";
dotenv.config();

export const home = (req, res) => {
  console.log(req.session);
  return res.render("home", {
    isLogin: req.session.isLogin,
    name: req.session.user,
  });
};
export const login = (req, res) => res.render("login");
export const join = (req, res) => res.render("join");

export const joinPost = async (req, res, next) => {
  const {
    body: { name, email, password, passwordVerify },
  } = req;
  try {
    if (password !== passwordVerify) {
      // const error = new Error();
      // error.status = 400;
      // error.message = "비밀번호가 틀립니다.";
      // return next(error);
      return next(createError(400, "비밀번호가 같지 않습니다."));
    }
    const existUser = await User.exists({ email }); // await을 꼭 붙여야하는가?

    if (existUser) {
      return next(createError(400, "이미 등록된 이메일입니다."));
    }
    console.log(process.env.BCRYPT);

    const hashedPassword = bcrypt.hashSync(password, +process.env.BCRYPT);
    // console.log(hashedPassword);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    console.log(newUser);
    return res.render("login");
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const loginPost = async (req, res, next) => {
  console.log(req.body);
  const {
    body: { email, password: bodypassword }, //bodypassword는 어디서 왓냥..?
  } = req;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(400, "등록된 이메일이 없습니다."));
    }
    const checkPassword = bcrypt.compareSync(bodypassword, user.password);
    if (!checkPassword) return next(createError(400), "비밀번호가 틀립니다.");

    const userInfo = { ...user._doc };
    console.log(userInfo);
    const { password, ...otherInfo } = userInfo;
    console.log(otherInfo);

    req.session.user = otherInfo;
    req.session.isLogin = true;

    console.log(req.session);
    res.redirect("/");
    const userExists = await User.exists({ email });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

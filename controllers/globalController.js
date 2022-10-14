import User from "../model/User.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import createError from "../util/createError.js";
dotenv.config();

export const home = (req, res) => {
  console.log(req.session);
  return res.render("home", {
    isLogin: req.session.isLogin, // req.session.isLogin은 언제 설정된거임니까?
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
      return next(createError(400, "비밀번호 다름"));
    }
    const existUser = await User.exists({ email });

    if (existUser) {
      // console.log("같은 이메일유저가 있습니다");
      // return res.status(400);
      return next(createError(400, "이미 등록된 아이디가 있습니다."));
    }

    const hashedPassword = bcrypt.hashSync(password, process.env.BCRYPT);

    // console.log(hashedPassword);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save(); //왜여기에 어웨잇을 붙이는가? 저장보다 밑에 랜더링을 먼저 실행될거 같아서인가?

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
    body: { email, password: bodypassword },
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

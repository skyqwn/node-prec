import Memory from "./model/Memory.js";
import multer from "multer";

// export const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/image");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
// });

// export const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

export const upload = multer({ dest: "uploads" });

// export const upload = multer({ dest: "uploads/" });
export const avatarMulter = multer({ dest: "uploads/avatar" });

export const localSetMiddleware = (req, res, next) => {
  res.locals.isLogin = Boolean(req.session.isLogin);
  // res.locals.csrfToken = req.csrfToken();
  res.locals.message = req.flash();
  res.locals.user = req.session.user || undefined;
  req.user = req.session.user || {};
  next();
};

export const isCreator = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    const memory = await Memory.findById(id);
    if (req.user._id !== String(memory.creator)) {
      return next(createError(403, "주인이 아닙니다."));
    }
    req.memory = memory;
    next();
  } catch (error) {
    next(error);
  }
};

export const isVerifiedEmail = (req, res, next) => {
  const { user } = req;
  if (!user.emailVerify) {
    req.flash("error", "이메일 인증이 안됌");
    return res.redirect("/join");
  }
  next();
};

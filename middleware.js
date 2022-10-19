import Memory from "./model/Memory.js";
import multer from "multer";

export const upload = multer({ dest: "uploads/" });

export const localSetMiddleware = (req, res, next) => {
  res.locals.isLogin = Boolean(req.session.isLogin);
  res.locals.user = req.session.user || {};
  req.user = req.session.user || {};
  next();
};

export const isCreator = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    const memory = await Memory.findById(id);
    if (req.user._id !== String(memory.creater)) {
      return next(createError(403, "주인이 아닙니다."));
    }
    req.memory = memory;
    next();
  } catch (error) {
    next(error);
  }
};

export const localSetMiddleware = (req, res, next) => {
  res.locals.isLogin = Boolean(req.session.isLogin);
  res.locals.user = req.session.user || {};
  next();
};

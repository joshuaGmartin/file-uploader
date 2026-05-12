//redirect to home if no logged in
module.exports.isAuthCheck = function (req, res, next) {
  if (!res.locals.isAuth) return res.redirect("/");
  next();
};

module.exports.isNoAuthCheck = function (req, res, next) {
  if (res.locals.isAuth) return res.redirect("/home");
  next();
};

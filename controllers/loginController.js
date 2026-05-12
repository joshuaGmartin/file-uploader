const { body, validationResult } = require("express-validator");
const passport = require("passport");

const validateUser = [
  body("username").trim().notEmpty().withMessage("Must include username"),
  body("password").trim().notEmpty().withMessage("Must include password"),
];

module.exports.getLogin = function (req, res) {
  res.render("login");
};

const auth = (req, res, next) =>
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      const values = req.body;
      const errors = { msg: info.message }; // convert authentication failure to error display

      return res.status(401).render("login", {
        errors: [errors],
        values: values,
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      return res.redirect("/home");
    });
  })(req, res, next); // passport.authenticate returns a function that needs to be called with wrapper function's (auth) parameters

module.exports.postLogin = [
  validateUser,
  // function (req, res, next) {
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const values = req.body;

      return res.render("login", {
        errors: errors.array(),
        values: values,
      });
    }

    next();
  },
  auth,
];

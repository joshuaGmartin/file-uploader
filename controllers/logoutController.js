const { body, validationResult } = require("express-validator");
const passport = require("passport");

module.exports.postLogout = function (req, res) {
  req.logout(function (err) {
    if (err) return next(err);

    res.redirect("/");
  });
};

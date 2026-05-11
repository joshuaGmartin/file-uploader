const { body, matchedData, validationResult } = require("express-validator");
const user = require("../models/user");
const passwordUtil = require("../lib/passwordUtil");

const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Must include username")
    .custom(async (value) => {
      const userMatch = await user.findByUsername(value);
      if (userMatch) throw new Error("Username already exists");
      return true;
    }),
  body("password")
    .trim()
    // .notEmpty()
    // .withMessage("Must include password")
    // .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    // .bail()
    .matches(/^(?=.*[a-z]).*$/)
    .withMessage("Password must include a lowercase letter")
    .matches(/^(?=.*[A-Z]).*$/)
    .withMessage("Password must include an uppercase letter")
    .matches(/^(?=.*\d).*$/)
    .withMessage("Password must include a number")
    .matches(/^(?=.*[^A-Za-z\d]).*$/)
    .withMessage("Password must include a special character"),

  body("confirm-password")
    .trim()
    // .notEmpty()
    // .withMessage("Must confirm password")
    // .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

module.exports.getRegister = function (req, res) {
  res.render("register");
};

module.exports.postRegister = [
  validateUser,
  async function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const values = req.body;

      return res.render("register", {
        errors: errors.array(),
        values: values,
      });
    }
    const { username, password } = matchedData(req); // gets sanitized data from the validation checks
    const hashedPassword = await passwordUtil.hashPassword(password);

    await user.createUser(username, hashedPassword);

    res.redirect("/login");
  },
];

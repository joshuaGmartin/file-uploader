const bcrypt = require("bcryptjs");
const user = require("../models/user");

module.exports.hashPassword = async function (password) {
  return await bcrypt.hash(password, 12); // 12 rounds is standard
};

module.exports.validatePassword = async function (passwordInput, userPassword) {
  return await bcrypt.compare(passwordInput, userPassword);
};

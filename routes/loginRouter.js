const loginRouter = require("express").Router();

loginRouter.get("/", (req, res) => {
  res.render("login");
});

module.exports = loginRouter;

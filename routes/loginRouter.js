const loginRouter = require("express").Router();
const loginController = require("../controllers/loginController");

loginRouter.get("/", loginController.getLogin);
loginRouter.post("/", loginController.postLogin);

module.exports = loginRouter;

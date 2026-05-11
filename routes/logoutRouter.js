const logoutRouter = require("express").Router();
const logoutController = require("../controllers/logoutController");

logoutRouter.post("/", logoutController.postLogout);

module.exports = logoutRouter;

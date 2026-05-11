const registerRouter = require("express").Router();
const registerController = require("../controllers/registerController");

registerRouter.get("/", registerController.getRegister);
registerRouter.post("/", registerController.postRegister);

module.exports = registerRouter;

const router = require("express").Router();
const middleware = require("../middleware/middleware");
const registerRouter = require("./registerRouter");
const loginRouter = require("./loginRouter");
const logoutRouter = require("./logoutRouter");
const driveRouter = require("./driveRouter");

router.get("/", middleware.isNoAuthCheck, (req, res) => res.render("index"));

router.use("/register", middleware.isNoAuthCheck, registerRouter);
router.use("/login", middleware.isNoAuthCheck, loginRouter);
router.use("/logout", middleware.isAuthCheck, logoutRouter);
router.use("/drive", middleware.isAuthCheck, driveRouter);

module.exports = router;

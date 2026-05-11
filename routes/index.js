const router = require("express").Router();
const loginRouter = require("./loginRouter");
const registerRouter = require("./registerRouter");

router.get("/", (req, res) => res.render("index"));

router.use("/register", registerRouter);
router.use("/login", loginRouter);

module.exports = router;

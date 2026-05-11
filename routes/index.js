const router = require("express").Router();
const registerRouter = require("./registerRouter");
const loginRouter = require("./loginRouter");
const logoutRouter = require("./logoutRouter");

router.get("/", (req, res) => res.render("index"));

router.use("/register", registerRouter);

// if (res.locals.isAuth) return res.redirect("/messages");
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);

module.exports = router;

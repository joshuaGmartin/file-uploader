const driveRouter = require("express").Router();
const folderRouter = require("./folderRouter");
const fileRouter = require("./fileRouter");

driveRouter.use("/folder", folderRouter);
driveRouter.use("/file", fileRouter);

// otherwise, redirect to root
driveRouter.use("/", (req, res) => res.redirect("/drive/folder/root"));

module.exports = driveRouter;

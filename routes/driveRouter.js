const driveRouter = require("express").Router();
const driveController = require("../controllers/driveController");
const folderRouter = require("./folderRouter");

driveRouter.get(
  "/:folderId",
  // folderOwnerChecker,
  driveController.getDrive,
);

driveRouter.use("/:folderId/folder", folderRouter);

// otherwise, redirect to root
driveRouter.use("/", (req, res) => res.redirect("/drive/root"));

module.exports = driveRouter;

const driveRouter = require("express").Router();
const driveController = require("../controllers/driveController");
const folderRouter = require("./folderRouter");

driveRouter.get(
  "/:folderId",
  // folderOwnerChecker,
  driveController.getDrive,
);

driveRouter.use("/:folderId/folder", folderRouter);

module.exports = driveRouter;

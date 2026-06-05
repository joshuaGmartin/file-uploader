const driveRouter = require("express").Router();
const middleware = require("../middleware/middleware");
const driveController = require("../controllers/driveController");
const folderRouter = require("./folderRouter");
const fileRouter = require("./fileRouter");

driveRouter.get(
  "/:folderId",
  middleware.folderExistOwnedCheck,
  driveController.getDrive,
);

driveRouter.use(
  "/:folderId/folder",
  middleware.folderExistOwnedCheck,
  folderRouter,
);

driveRouter.use(
  "/:folderId/file",
  middleware.folderExistOwnedCheck,
  fileRouter,
);

// otherwise, redirect to root
driveRouter.use("/", (req, res) => res.redirect("/drive/root"));

module.exports = driveRouter;

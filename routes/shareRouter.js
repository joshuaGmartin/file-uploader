const shareRouter = require("express").Router();
const middleware = require("../middleware/middleware");
const folderController = require("../controllers/folderController");
const fileController = require("../controllers/fileController");

shareRouter.use(
  "/:shareToken/folder/:folderId",
  middleware.shareFolderCheck,
  folderController.getDriveFolder,
);

shareRouter.use(
  "/:shareToken/file/:fileId",
  middleware.shareFileCheck,
  fileController.getFile,
);

// otherwise, redirect to root
shareRouter.use("/", (req, res) => res.redirect("/drive/folder/root"));

module.exports = shareRouter;

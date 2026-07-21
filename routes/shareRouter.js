const shareRouter = require("express").Router();
const middleware = require("../middleware/middleware");
const folderController = require("../controllers/folderController");

shareRouter.use(
  "/:shareToken/folder/:folderId",
  middleware.shareCheck,
  folderController.getDriveFolder,
);

// otherwise, redirect to root
shareRouter.use("/", (req, res) => res.redirect("/drive/folder/root"));

module.exports = shareRouter;

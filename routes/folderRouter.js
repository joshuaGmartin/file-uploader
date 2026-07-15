const folderRouter = require("express").Router({ mergeParams: true });
const middleware = require("../middleware/middleware");
const folderController = require("../controllers/folderController");
const fileController = require("../controllers/fileController");

folderRouter.get(
  "/:folderId",
  middleware.folderExistOwnedCheck,
  folderController.getDriveFolder,
);
folderRouter.post(
  "/:folderId/create",
  middleware.folderExistOwnedCheck,
  folderController.postCreateFolder,
);
folderRouter.post(
  "/:folderId/edit",
  middleware.folderExistOwnedCheck,
  folderController.postEditFolder,
);
folderRouter.post(
  "/:folderId/delete",
  middleware.folderExistOwnedCheck,
  folderController.postDeleteFolder,
);
folderRouter.post(
  "/:folderId/add-file",
  middleware.folderExistOwnedCheck,
  fileController.postAddFile,
);
folderRouter.post(
  "/:folderId/allow-share",
  middleware.folderExistOwnedCheck,
  folderController.postShareFolder,
);

module.exports = folderRouter;

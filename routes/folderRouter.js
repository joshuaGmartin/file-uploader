const folderRouter = require("express").Router({ mergeParams: true });
const folderController = require("../controllers/folderController");
const fileController = require("../controllers/fileController");

folderRouter.get("/:folderId", folderController.getDriveFolder);
folderRouter.post("/:folderId/create", folderController.postCreateFolder);
folderRouter.post("/:folderId/edit", folderController.postEditFolder);
folderRouter.post("/:folderId/delete", folderController.postDeleteFolder);
folderRouter.post("/:folderId/add-file", fileController.postAddFile);

module.exports = folderRouter;

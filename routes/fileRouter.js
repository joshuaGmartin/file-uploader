const fileRouter = require("express").Router({ mergeParams: true });
const fileController = require("../controllers/fileController");

fileRouter.get("/:fileId", fileController.getFile);
fileRouter.post("/:fileId/edit", fileController.postEditFile);
fileRouter.post("/:fileId/delete", fileController.postDeleteFile);

module.exports = fileRouter;

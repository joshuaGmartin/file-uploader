const fileRouter = require("express").Router({ mergeParams: true });
const fileController = require("../controllers/fileController");

// fileRouter.post("/create", fileController.postAddFile);
fileRouter.post("/:fileId/edit", fileController.postEditFile);
fileRouter.post("/:fileId/delete", fileController.postDeleteFile);

module.exports = fileRouter;

const fileRouter = require("express").Router({ mergeParams: true });
const fileController = require("../controllers/fileController");

fileRouter.post("/create", fileController.postCreateFile);
// fileRouter.post("/edit", fileController.postEditFile);
// fileRouter.post("/delete", fileController.postDeleteFile);

module.exports = fileRouter;

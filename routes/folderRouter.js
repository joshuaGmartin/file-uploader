const folderRouter = require("express").Router({ mergeParams: true });
const folderController = require("../controllers/folderController");

folderRouter.post("/create", folderController.postCreateFolder);
folderRouter.post("/edit", folderController.postEditFolder);

module.exports = folderRouter;

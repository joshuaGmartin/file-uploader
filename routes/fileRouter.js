const fileRouter = require("express").Router({ mergeParams: true });
const middleware = require("../middleware/middleware");
const fileController = require("../controllers/fileController");

// need file owned/exist middleware
fileRouter.get(
  "/:fileId",
  middleware.fileExistOwnedCheck,
  fileController.getFile,
);

fileRouter.post(
  "/:fileId/edit",
  middleware.fileExistOwnedCheck,
  fileController.postEditFile,
);

fileRouter.post(
  "/:fileId/delete",
  middleware.fileExistOwnedCheck,
  fileController.postDeleteFile,
);

fileRouter.get(
  "/:fileId/download",
  middleware.fileExistOwnedCheck,
  fileController.getDownloadFile,
);

module.exports = fileRouter;

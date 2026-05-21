const { body, matchedData, validationResult } = require("express-validator");
const driveController = require("../controllers/driveController");
const folder = require("../models/folder");

//fix names
const validateUser = [
  body("folderName").trim().notEmpty().withMessage("Must include folder name"),
];

module.exports.postCreateFolder = [
  validateUser,
  async function (req, res) {
    const folderId = req.params.folderId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // const values = req.body; // not needed; this is used to refill the incorrect value(s) for UX. But only empty folder names are rejected here.
      const driveData = await driveController.getDriveData(
        req.params.folderId,
        req.user.id,
      );
      /* 
      existence of errors implies modal needs to remain open. Thus, reuse the modal
      name as the errors sub-object key name and check for modal name matching in
      the errors.ejs call above each corresponding form. Also allows the use of modal
      name in the errors rendering
      */
      const modal = "createFolder";

      return res.render("drive", {
        ...driveData,
        modal,
        errors: {
          [modal]: errors.array(),
        },
      });
    }

    const { folderName } = matchedData(req);

    await folder.createFolder(folderName, req.user.id, folderId);

    res.redirect("/drive/" + folderId);
  },
];

module.exports.postEditFolder = [
  async function (req, res) {
    const folderId = req.params.folderId;

    console.log("edited folder - wip");

    res.redirect("/drive/" + folderId);
  },
];

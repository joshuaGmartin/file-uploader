const { body, matchedData, validationResult } = require("express-validator");
const driveController = require("../controllers/driveController");
const folder = require("../models/folder");

const validateUser = [
  body("folderName").trim().notEmpty().withMessage("Must include folder name"),
];

module.exports.postCreateFolder = [
  validateUser,
  async function (req, res) {
    const folderId = req.params.folderId; // this is the parent folder id
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // const values = req.body; // not needed; this is used to refill the incorrect value(s) for UX. But only empty folder names are rejected here.

      /* 
      existence of errors implies modal needs to remain open. Thus, reuse the modal
      name as the errors sub-object key name and check for modal name matching in
      the errors.ejs call above each corresponding form. Also allows the use of modal
      name in the errors rendering
      */
      req.session.modal = "createFolder";
      req.session.errors = {
        [req.session.modal]: errors.array(),
      };

      // Bug fix: force save session; timing issue
      return req.session.save(() => {
        res.redirect("/drive/" + folderId);
      });
    }

    const { folderName } = matchedData(req);

    await folder.createFolder(folderName, req.user.id, folderId);

    res.redirect("/drive/" + folderId);
  },
];

module.exports.postEditFolder = [
  validateUser,
  async function (req, res) {
    const folderId = req.params.folderId; // this is the edit folder id (child of current page's folder)

    const editFolder = await folder.findByFolderID(folderId);
    const parentId = await folder.getParentId(folderId); // current page folder id
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // const values = req.body; // not useful here; need original value, not incorrect value, in this case

      /* 
      existence of errors implies modal needs to remain open. Thus, reuse the modal
      name as the errors sub-object key name and check for modal name matching in
      the errors.ejs call above each corresponding form. Also allows the use of modal
      name in the errors rendering
      */
      req.session.modal = "editFolder";
      req.session.modalFolderId = folderId;
      req.session.modalValues = { folderName: editFolder.name };
      req.session.errors = {
        [req.session.modal]: errors.array(),
      };

      return req.session.save(() => {
        res.redirect("/drive/" + parentId);
      });
    }

    const { folderName } = matchedData(req);

    await folder.editFolderName(folderId, folderName);

    res.redirect(
      "/drive/" + parentId, // root folder parentId is null
    );
  },
];

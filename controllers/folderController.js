const { body, matchedData, validationResult } = require("express-validator");
const folder = require("../models/folder");
const file = require("../models/file");

const validateFolder = [
  body("folderName").trim().notEmpty().withMessage("Must include folder name"),
];

async function getDriveData(folderId, userId) {
  const childFolders = await folder.getChildren(folderId, userId);
  const parentFolders = await folder.getParents(folderId);
  const files = await file.getFiles(folderId);

  let pageTitle;
  if (folderId === "root") pageTitle = "root";
  else pageTitle = (await folder.findByFolderID(folderId)).name;

  return { pageTitle, folderId, childFolders, parentFolders, files };
}

function handlePopupData(req) {
  // save popup data for this render
  const modal = req.session.modal || null;
  const modalFolderId = req.session.modalFolderId || null;
  const modalValues = req.session.modalValues || null;
  const errors = req.session.errors || null;

  // clear popup data from session
  req.session.modal = null;
  req.session.modalFolderId = null;
  req.session.modalValues = null;
  req.session.errors = null;

  return { modal, modalFolderId, modalValues, errors };
}

module.exports.getDriveFolder = async function (req, res) {
  //need folder no exist redirect?
  const driveData = await getDriveData(req.params.folderId, req.user.id);
  const popupData = handlePopupData(req);

  res.render("drive", {
    ...driveData,
    ...popupData,
  });
};

module.exports.postCreateFolder = [
  validateFolder,
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
      //  save in session to persist popup on error
      req.session.modal = "createFolder";
      req.session.errors = {
        [req.session.modal]: errors.array(),
      };

      // Bug fix: force save session; timing issue
      return req.session.save(() => {
        res.redirect("/drive/folder/" + folderId);
      });
    }

    const { folderName } = matchedData(req);

    await folder.createFolder(folderName, req.user.id, folderId);

    return res.redirect("/drive/folder/" + folderId);
  },
];

module.exports.postEditFolder = [
  validateFolder,
  async function (req, res) {
    const folderId = req.params.folderId; // this is the edit folder id (not necessarily the same as current page folder id)
    const editFolder = await folder.findByFolderID(folderId);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // const values = req.body; // not useful here; need original value, not incorrect value, in this case

      /* 
      existence of errors implies modal needs to remain open. Thus, reuse the modal
      name as the errors sub-object key name and check for modal name matching in
      the errors.ejs call above each corresponding form. Also allows the use of modal
      name in the errors rendering
      */
      //  save in session to persist popup on error
      req.session.modal = "editFolder";
      req.session.modalFolderId = folderId;
      req.session.modalValues = { folderName: editFolder.name };
      req.session.errors = {
        [req.session.modal]: errors.array(),
      };

      return req.session.save(() => {
        res.redirect("/drive/folder/" + req.body.currentFolderId);
      });
    }

    const { folderName } = matchedData(req);

    await folder.editFolderName(folderId, folderName);

    res.redirect("/drive/folder/" + req.body.currentFolderId);
  },
];

module.exports.postDeleteFolder = async function (req, res) {
  const folderId = req.params.folderId; // this is the edit folder id (not necessarily the same as current page folder id)

  // if deleting current page folder, redirect to parent folder. Else stay on same page
  let redirectId = req.body.currentFolderId;
  // caveat for root page (no parent)
  if (folderId === req.body.currentFolderId && folderId !== "root") {
    redirectId = await folder.getParentId(folderId);
  }

  // can't delete folder before needing to check parent
  await folder.deleteFolder(folderId, req.user.id);

  res.redirect("/drive/folder/" + redirectId);
};

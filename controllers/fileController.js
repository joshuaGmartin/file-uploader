const { body, matchedData, validationResult } = require("express-validator");
const multer = require("multer");
const file = require("../models/file");
const folder = require("../models/folder");

const MAX_SIZE = 200 * 1024; // 100 KB
const MAX_FILES = 2;
const path = "uploadFiles";
const dest = "uploads/";

const upload = multer({
  dest,
  limits: {
    files: MAX_FILES,
    fileSize: MAX_SIZE,
  },
}).array(path);

const validateFile = [
  body("fileName").trim().notEmpty().withMessage("Must include file name"),
];

function handlePopupData(req) {
  // save popup data for this render
  const modal = req.session.modal || null;
  const modalFileId = req.session.modalFileId || null;
  const modalValues = req.session.modalValues || null;
  const errors = req.session.errors || null;

  // clear popup data from session
  req.session.modal = null;
  req.session.modalFileId = null;
  req.session.modalValues = null;
  req.session.errors = null;

  return { modal, modalFileId, modalValues, errors };
}

module.exports.getFile = async function (req, res) {
  const fileId = req.params.fileId;
  const currentFile = await file.findByFileID(fileId);
  const parentFolders = await folder.getParents(currentFile.folderId);
  const popupData = handlePopupData(req);

  res.render("drive/file", {
    pageTitle: fileId,
    currentFile,
    fileId,
    parentFolders,
    ...popupData,
  });
};

// addFile is always called from /folder route
module.exports.postAddFile = function (req, res) {
  const folderId = req.params.folderId; // current page folder id

  /* multer only passes errors upon upload failure, 
  forcing the need to validate, store, and handle errors in one function */

  let errors = []; // errors.ejs expects array of objects with msg and path keys

  upload(req, res, async function (err) {
    if (err) {
      // if (err instanceof multer.MulterError) {
      let msg;
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          msg = "File(s) are over the size limit";
          break;
        case "LIMIT_FILE_COUNT":
          msg = "Number of files is over the limit";
          break;
        default:
          msg = err.message;
          break;
      }

      // multer halts on first error, forcing user to see one error at a time (for upload safety)
      errors.push({
        msg,
        path,
      });
    }

    // handle errors
    if (errors.length > 0) {
      req.session.modal = "addFiles";
      req.session.errors = {
        [req.session.modal]: errors,
      };

      // Bug fix: force save session; timing issue
      return req.session.save(() => {
        res.redirect("/drive/folder/" + folderId);
      });
    }

    // if no errors, write to db
    await file.addFiles(req.files, req.user.id, folderId);

    return res.redirect("/drive/folder/" + folderId);
  });
};

module.exports.postEditFile = [
  validateFile,
  async function (req, res) {
    const fileId = req.params.fileId;
    const editFile = await file.findByFileID(fileId);
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
      req.session.modal = "editFile";
      req.session.modalFileId = fileId;
      req.session.modalValues = { fileName: editFile.name };
      req.session.errors = {
        [req.session.modal]: errors.array(),
      };

      // check if file edit req is on folder page
      if (req.body.currentFolderId && req.body.currentFolderId !== "") {
        return req.session.save(() => {
          res.redirect("/drive/folder/" + req.body.currentFolderId);
        });
      }
      // redirect to file page if not
      else {
        return req.session.save(() => {
          res.redirect("/drive/file/" + fileId);
        });
      }
    }

    const { fileName } = matchedData(req);

    await file.editFileName(fileId, fileName);

    // check if file edit req is on folder page
    if (req.body.currentFolderId && req.body.currentFolderId !== "") {
      return req.session.save(() => {
        res.redirect("/drive/folder/" + req.body.currentFolderId);
      });
    }
    // redirect to file page if not
    else {
      return req.session.save(() => {
        res.redirect("/drive/file/" + fileId);
      });
    }
  },
];

module.exports.postDeleteFile = async function (req, res) {
  const fileId = req.params.fileId;

  // if deleting file on parent page, stay on current page. Else redirect to parent folder
  let redirectId;
  if (req.body.currentFolderId) redirectId = req.body.currentFolderId;
  else {
    const editFile = await file.findByFileID(fileId);
    redirectId = editFile.folderId;
  }
  // caveat for root page (no folderId)
  if (redirectId === null) redirectId = "root";

  await file.deleteFile(fileId);

  res.redirect("/drive/folder/" + redirectId);
};

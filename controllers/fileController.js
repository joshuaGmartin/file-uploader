const multer = require("multer");
const file = require("../models/file");

const MAX_SIZE = 100 * 1024; // 100 KB
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

// addFile is always called form /folder route
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

    // if no errors, add to db
    await file.addFiles(req.files, req.user.id, folderId);

    return res.redirect("/drive/folder/" + folderId);
  });
};

// module.exports.postEditFolder = [
//   // validateFile,
//   async function (req, res) {
//     const folderId = req.params.folderId; // this is the edit folder id (not necessarily the same as current page folder id)
//     const editFolder = await folder.findByFolderID(folderId);
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       // const values = req.body; // not useful here; need original value, not incorrect value, in this case

//       /*
//       existence of errors implies modal needs to remain open. Thus, reuse the modal
//       name as the errors sub-object key name and check for modal name matching in
//       the errors.ejs call above each corresponding form. Also allows the use of modal
//       name in the errors rendering
//       */
//       //  save in session to persist popup on error
//       req.session.modal = "editFolder";
//       req.session.modalFolderId = folderId;
//       req.session.modalValues = { folderName: editFolder.name };
//       req.session.errors = {
//         [req.session.modal]: errors.array(),
//       };

//       return req.session.save(() => {
//         res.redirect("/drive/" + req.body.currentFolderId);
//       });
//     }

//     const { folderName } = matchedData(req);

//     await folder.editFolderName(folderId, folderName);

//     res.redirect("/drive/" + req.body.currentFolderId);
//   },
// ];

// module.exports.postDeleteFolder = async function (req, res) {
//   const folderId = req.params.folderId; // this is the edit folder id (not necessarily the same as current page folder id)

//   // if deleting current page folder, redirect to parent folder. Else stay on same page
//   let redirectId = req.body.currentFolderId;
//   if (folderId === req.body.currentFolderId && folderId !== "root") {
//     // caveat for root page (no parent)
//     redirectId = await folder.getParentId(folderId);
//   }

//   // can't delete folder before needing to check parent

//   await folder.deleteFolder(folderId, req.user.id);

//   res.redirect("/drive/" + redirectId);
// };

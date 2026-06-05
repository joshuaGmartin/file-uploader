const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// const { body, matchedData, validationResult } = require("express-validator");

// const validateFile = [
// body("fileName").trim().notEmpty().withMessage("Must include file name"),
// ];

module.exports.postCreateFile = [
  // validateFile,
  upload.array("uploadFiles", 2),
  async function (req, res) {
    console.log(req.files);
    // const folderId = req.params.folderId; // this is the parent folder id
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   // const values = req.body; // not needed; this is used to refill the incorrect value(s) for UX. But only empty folder names are rejected here.
    //   /*
    //   existence of errors implies modal needs to remain open. Thus, reuse the modal
    //   name as the errors sub-object key name and check for modal name matching in
    //   the errors.ejs call above each corresponding form. Also allows the use of modal
    //   name in the errors rendering
    //   */
    //   //  save in session to persist popup on error
    //   req.session.modal = "createFolder";
    //   req.session.errors = {
    //     [req.session.modal]: errors.array(),
    //   };
    //   // Bug fix: force save session; timing issue
    //   return req.session.save(() => {
    //     res.redirect("/drive/" + folderId);
    //   });
    // }
    // const { folderName } = matchedData(req);
    // await folder.createFolder(folderName, req.user.id, folderId);
    // res.redirect("/drive/" + folderId);
  },
];

module.exports.postEditFolder = [
  // validateFile,
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
        res.redirect("/drive/" + req.body.currentFolderId);
      });
    }

    const { folderName } = matchedData(req);

    await folder.editFolderName(folderId, folderName);

    res.redirect("/drive/" + req.body.currentFolderId);
  },
];

module.exports.postDeleteFolder = async function (req, res) {
  const folderId = req.params.folderId; // this is the edit folder id (not necessarily the same as current page folder id)

  // if deleting current page folder, redirect to parent folder. Else stay on same page
  let redirectId = req.body.currentFolderId;
  if (folderId === req.body.currentFolderId && folderId !== "root") {
    // caveat for root page (no parent)
    redirectId = await folder.getParentId(folderId);
  }

  // can't delete folder before needing to check parent

  await folder.deleteFolder(folderId, req.user.id);

  res.redirect("/drive/" + redirectId);
};

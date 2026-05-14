const { body, matchedData, validationResult } = require("express-validator");
const folder = require("../models/folder");

const validateUser = [
  body("folderName").trim().notEmpty().withMessage("Must include folder name"),
];

module.exports.postCreateFolder = [
  validateUser,
  async function (req, res) {
    const folderId = req.params.folderId;
    // const errors = validationResult(req);

    const { folderName } = matchedData(req);

    await folder.createFolder(folderName, req.user.id, folderId);

    res.redirect("/drive/" + folderId);
  },
];

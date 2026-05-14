const folder = require("../models/folder");

module.exports.getDrive = async function (req, res) {
  //need folder no exist redirect?
  const folderId = req.params.folderId;
  let pageTitle;

  if (folderId === "root") {
    // get root folders
    pageTitle = "root";
  } else {
    // get folder folders
    pageTitle = folder.name;
  }

  res.render("drive", { pageTitle, folderId });
};

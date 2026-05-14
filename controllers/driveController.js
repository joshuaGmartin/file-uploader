const folder = require("../models/folder");

module.exports.getDrive = async function (req, res) {
  //need folder no exist redirect?
  const folderId = req.params.folderId;
  let pageTitle;

  const childfolders = await folder.getChildren(folderId, req.user.id);

  if (folderId === "root") pageTitle = "root";
  // else pageTitle = folder.name;

  res.render("drive", { pageTitle, folderId, childfolders });
};

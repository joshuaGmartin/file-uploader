const folder = require("../models/folder");

module.exports.getDrive = async function (req, res) {
  //need folder no exist redirect?
  const folderId = req.params.folderId;

  const childFolders = await folder.getChildren(folderId, req.user.id);
  const parentFolders = await folder.getParents(folderId);

  let pageTitle;
  if (folderId === "root") pageTitle = "root";
  else pageTitle = (await folder.findByFolderID(folderId)).name;

  res.render("drive", { pageTitle, folderId, childFolders, parentFolders });
};

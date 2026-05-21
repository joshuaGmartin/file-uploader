const folder = require("../models/folder");

module.exports.getDriveData = async function (folderId, userId) {
  const childFolders = await folder.getChildren(folderId, userId);
  const parentFolders = await folder.getParents(folderId);

  let pageTitle;
  if (folderId === "root") pageTitle = "root";
  else pageTitle = (await folder.findByFolderID(folderId)).name;

  return { pageTitle, folderId, childFolders, parentFolders };
};

module.exports.getDrive = async function (req, res) {
  //need folder no exist redirect?
  const driveData = await module.exports.getDriveData(
    req.params.folderId,
    req.user.id,
  );

  res.render("drive", { ...driveData });
};

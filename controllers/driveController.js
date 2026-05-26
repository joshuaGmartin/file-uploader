const folder = require("../models/folder");

module.exports.getDrive = async function (req, res) {
  //need folder no exist redirect?
  const driveData = await getDriveData(req.params.folderId, req.user.id);
  const popupData = handlePopupData(req);

  res.render("drive", {
    ...driveData,
    ...popupData,
  });
};

async function getDriveData(folderId, userId) {
  const childFolders = await folder.getChildren(folderId, userId);
  const parentFolders = await folder.getParents(folderId);

  let pageTitle;
  if (folderId === "root") pageTitle = "root";
  else pageTitle = (await folder.findByFolderID(folderId)).name;

  return { pageTitle, folderId, childFolders, parentFolders };
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

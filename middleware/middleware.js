const folder = require("../models/folder");
const file = require("../models/file");

//redirect to home if no logged in
module.exports.isAuthCheck = function (req, res, next) {
  if (!res.locals.isAuth) return res.status(401).redirect("/");
  next();
};

// if logged in, home redirects to root
module.exports.isNoAuthCheck = function (req, res, next) {
  if (res.locals.isAuth) return res.redirect("/drive/root");
  next();
};

module.exports.folderExistOwnedCheck = async function (req, res, next) {
  const folderId = req.params.folderId;

  // if root, skip (pulls owned root folders/files via controller)
  if (folderId === "root") return next();

  // check for ints (passed as string in params)
  if (!/^\d+$/.test(folderId)) {
    return res.status(404).render("404");
  }

  const thisFolder = await folder.findByFolderID(folderId);
  if (!thisFolder) return res.status(404).render("404");

  // if folder exist, check owner
  if (thisFolder.ownerId !== req.user.id)
    return res.status(403).render("access-denied"); // need no access page

  // else, continue
  next();
};

module.exports.fileExistOwnedCheck = async function (req, res, next) {
  const fileId = req.params.fileId;

  // check for ints (passed as string in params)
  if (!/^\d+$/.test(fileId)) {
    return res.status(404).render("404");
  }

  const thisFile = await file.findByFileID(fileId);
  if (!thisFile) return res.status(404).render("404");

  // if folder exist, check owner
  if (thisFile.ownerId !== req.user.id)
    return res.status(403).render("access-denied"); // need no access page

  // else, continue
  next();
};

module.exports.shareCheck = async function (req, res, next) {
  // ======== check folder ========
  const folderId = req.params.folderId;

  // check for ints (passed as string in params)
  if (!/^\d+$/.test(folderId)) {
    return res.status(404).render("404");
  }
  // check if exists
  const thisFolder = await folder.findByFolderID(folderId);
  if (!thisFolder) return res.status(404).render("404");

  // ======== check share ========
  const shareToken = req.params.shareToken;
  // check if exist
  const shareFolder = await folder.findByShareToken(shareToken);
  if (!shareFolder) return res.status(404).render("404");
  // check date
  if (new Date() > shareFolder.shareExpiresAt)
    return res.status(403).render("access-denied");
  // check if current is or is a child of shared folder
  // getParents() return current folder also
  const parentFolders = (await folder.getParents(folderId)).reverse();
  let isShareable = false;
  for (const parent of parentFolders) {
    if (parent.shareToken === shareToken) {
      isShareable = true;
      break;
    }
  }
  if (!isShareable) return res.status(403).render("access-denied");

  // else, continue
  next();
};

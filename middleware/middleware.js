const folder = require("../models/folder");

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
  let folderId = req.params.folderId;

  // if root, skip (pulls owned root folders/files via controller)
  if (folderId === "root") return next();

  // check for ints (passed as string in params)
  if (!/^\d+$/.test(req.params.folderId)) {
    return res.status(404).render("404");
  }

  const thisFolder = await folder.findByFolderID(folderId);
  // change to no access
  if (!thisFolder) return res.status(404).render("404");

  // if folder exist, check owner
  if (thisFolder.ownerId !== req.user.id)
    return res.status(403).render("access-denied"); // need no access page

  // else, continue
  next();
};

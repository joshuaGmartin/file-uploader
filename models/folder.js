const prisma = require("../lib/prisma.js");
const file = require("./file.js");
const crypto = require("crypto");
const supabase = require("../lib/supabase.js");

module.exports.createFolder = async function (folderName, ownerId, parentId) {
  const isRoot = parentId === "root";

  return await prisma.folder.create({
    data: {
      name: folderName,
      ownerId,
      parentId: isRoot ? null : Number(parentId),
    },
  });
};

module.exports.findByFolderID = async function (id, ownerId) {
  return await prisma.folder.findUnique({
    where: { id: Number(id) },
    include: { children: true },
  });
};

module.exports.getChildren = async function (folderId, userId) {
  let children;
  if (folderId === "root") {
    children = await prisma.folder.findMany({
      where: {
        ownerId: userId,
        parentId: null, // null parent implies root level folder
      },
    });
  } else children = (await module.exports.findByFolderID(folderId)).children;

  // prisma's orderBy does not allow for case-insensitive ordering
  children.sort((a, b) => a.name.localeCompare(b.name));

  return children;
};

module.exports.getParents = async function (folderId) {
  async function getRawParents(folderId) {
    if (folderId === "root") return []; // close early if in root ("root" from driveController)
    if (folderId === null) return []; // end if reach root (null from recursion in DB)

    const thisFolder = await module.exports.findByFolderID(folderId);

    return [thisFolder].concat(await getRawParents(thisFolder.parentId));
  }

  let rawParents = await getRawParents(folderId);
  rawParents.reverse(); // need top down for /drive path display

  return rawParents;
};

module.exports.editFolderName = async function (folderId, folderName) {
  return await prisma.folder.update({
    where: { id: Number(folderId) },
    data: { name: folderName },
  });
};

module.exports.getParentId = async function (folderId) {
  const parentId = (await module.exports.findByFolderID(folderId)).parentId;

  return parentId ? parentId : "root";
};

module.exports.deleteFolder = async function (folderId, ownerId) {
  // root files do not cascade upon delete (they belong to "no" folder)
  // all other files will cascade upon their folder deletion

  const filesToDeleteFromBucket = await getAllSubFiles(folderId, ownerId);
  const deleteFilePaths = filesToDeleteFromBucket.map((f) => f.path);

  const { error } = await supabase.storage
    .from("uploads-bucket")
    .remove(deleteFilePaths);

  if (folderId === "root") {
    await prisma.folder.deleteMany({
      where: {
        ownerId: Number(ownerId),
        parentId: null, // folder deletion cascades down from here
      },
    });

    await prisma.file.deleteMany({
      where: {
        ownerId: Number(ownerId),
        folderId: null,
      },
    });

    return;
  }

  return await prisma.folder.delete({
    where: {
      id: Number(folderId),
    },
  });
};

module.exports.allowShareFolder = async function (folderId, shareTime) {
  const shareToken = crypto.randomUUID();
  const shareExpiresAt = addDays(Number(shareTime));

  return await prisma.folder.update({
    where: { id: Number(folderId) },
    data: { shareToken, shareExpiresAt },
  });
};

module.exports.findByShareToken = async function (shareToken) {
  return await prisma.folder.findUnique({
    where: { shareToken },
  });
};

function addDays(numDays) {
  const date = new Date();
  date.setDate(date.getDate() + numDays);
  return date;
}

async function getAllSubFiles(folderId, ownerId) {
  let allFiles = await file.getFiles(folderId, ownerId);
  const subFoldersToRecurse = await module.exports.getChildren(
    folderId,
    ownerId,
  );

  const nestedFilesArrays = await Promise.all(
    subFoldersToRecurse.map((subFolder) =>
      getAllSubFiles(subFolder.id, ownerId),
    ),
  );

  for (const subFiles of nestedFilesArrays) {
    allFiles.push(...subFiles);
  }

  return allFiles;
}

const prisma = require("../lib/prisma.js");

module.exports.createFolder = async function (folderName, ownerId, parentId) {
  const isRoot = parentId === "root";

  if (parentId === "root") {
    return await prisma.folder.create({
      data: {
        name: folderName,
        ownerId,
        parentId: isRoot ? null : Number(parentId),
      },
    });
  }
};

module.exports.getChildren = async function (folderId, userId) {
  if (folderId === "root") {
    return await prisma.folder.findMany({
      where: {
        ownerId: userId,
        parentId: null,
      },
    });
  }
};

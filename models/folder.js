const prisma = require("../lib/prisma.js");

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

module.exports.findByFolderID = async function (id) {
  return await prisma.folder.findUnique({
    where: { id: Number(id) },
    include: { children: true },
  });
};

module.exports.getChildren = async function (folderId, userId) {
  if (folderId === "root") {
    return await prisma.folder.findMany({
      where: {
        ownerId: userId,
        parentId: null, // null parent implies root level folder
      },
    });
  }

  return (await this.findByFolderID(folderId)).children;
};

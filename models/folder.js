const prisma = require("../lib/prisma.js");

module.exports.createFolder = async function (folderName, ownerId, parentId) {
  const isRoot = parentId === "root";

  if (parentId === "root") {
    const folder = await prisma.folder.create({
      data: {
        name: folderName,
        ownerId,
        parentId: isRoot ? null : Number(parentId),
      },
    });
  }
};

// module.exports.findByUsername = async function (username) {
//   return await prisma.user.findUnique({
//     where: { username }, // { username } = { username: username}
//   });
// };

// module.exports.findByUserID = async function (id) {
//   return await prisma.user.findUnique({
//     where: { id }, // { id } = { id: id}
//   });
// };

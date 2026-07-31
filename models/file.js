const prisma = require("../lib/prisma.js");
const supabase = require("../lib/supabase.js");

module.exports.addFiles = async function (files, ownerId, folderId) {
  const isRoot = folderId === "root";

  files.forEach(async (file) => {
    const storagePath = `user_${ownerId}/${DataTransfer.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("uploads-bucket")
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    // need add path to file schema model===============================================

    await prisma.file.create({
      data: {
        name: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        ownerId,
        folderId: isRoot ? null : Number(folderId),
      },
    });

    return;
  });
};

module.exports.getFiles = async function (folderId, userId) {
  const isRoot = folderId === "root";

  let children = await prisma.file.findMany({
    where: {
      folderId: isRoot ? null : Number(folderId),
      ownerId: userId,
    },
  });

  // prisma's orderBy does not allow for case-insensitive ordering
  children.sort((a, b) => a.name.localeCompare(b.name));

  return children;
};

module.exports.findByFileID = async function (id) {
  return await prisma.file.findUnique({
    where: { id: Number(id) },
  });
};

module.exports.editFileName = async function (fileId, fileName) {
  return await prisma.file.update({
    where: { id: Number(fileId) },
    data: { name: fileName },
  });
};

module.exports.deleteFile = async function (fileId) {
  await prisma.file.delete({
    where: {
      id: Number(fileId),
    },
  });

  return;
};

// module.exports.getChildren = async function (folderId, userId) {
//   if (folderId === "root") {
//     return await prisma.folder.findMany({
//       where: {
//         ownerId: userId,
//         parentId: null, // null parent implies root level folder
//       },
//     });
//   }

//   return (await this.findByFolderID(folderId)).children;
// };

// module.exports.getParents = async function (folderId) {
//   async function getRawParents(folderId) {
//     if (folderId === "root") return []; // close early if in root ("root" from driveController)
//     if (folderId === null) return []; // end if reach root (null from recursion in DB)

//     const thisFolder = await module.exports.findByFolderID(folderId);

//     return [thisFolder].concat(await getRawParents(thisFolder.parentId));
//   }

//   let rawParents = await getRawParents(folderId);
//   rawParents.reverse(); // need top down for /drive path display

//   return rawParents;
// };

// module.exports.getParentId = async function (folderId) {
//   const parentId = (await module.exports.findByFolderID(folderId)).parentId;

//   return parentId ? parentId : "root";

//   return await prisma.folder.delete({
//     where: {
//       id: Number(folderId),
//     },
//   });
// };

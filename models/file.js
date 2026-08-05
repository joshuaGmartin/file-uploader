const prisma = require("../lib/prisma.js");
const supabase = require("../lib/supabase.js");

module.exports.addFiles = async function (files, ownerId, folderId) {
  const isRoot = folderId === "root";

  for (const file of files) {
    const storagePath = `user_${ownerId}/${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("uploads-bucket")
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
      });

    await prisma.file.create({
      data: {
        originalName: file.originalname,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: storagePath,
        ownerId,
        folderId: isRoot ? null : Number(folderId),
      },
    });
  }

  return;
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
  children.sort((a, b) => a.filename.localeCompare(b.filename));

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
    data: { filename: fileName },
  });
};

module.exports.deleteFile = async function (fileId) {
  const thisFile = await module.exports.findByFileID(fileId);

  const { error } = await supabase.storage
    .from("uploads-bucket")
    .remove([thisFile.path]);

  await prisma.file.delete({
    where: {
      id: Number(fileId),
    },
  });

  return;
};

module.exports.getDownloadUrl = async function (fileId) {
  const thisFile = await module.exports.findByFileID(fileId);

  // for private buckets (Generates a temporary signed URL valid for 60s)
  const { data, error } = await supabase.storage
    .from("uploads-bucket")
    .createSignedUrl(thisFile.path, 60, {
      download: thisFile.filename,
    });

  return data.signedUrl;
};

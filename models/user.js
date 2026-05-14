const prisma = require("../lib/prisma.js");

module.exports.createUser = async function (username, password) {
  return await prisma.user.create({
    data: {
      username,
      password,
    },
  });
};

module.exports.findByUsername = async function (username) {
  return await prisma.user.findUnique({
    where: { username }, // { username } = { username: username}
  });
};

module.exports.findByUserID = async function (id) {
  return await prisma.user.findUnique({
    where: { id },
    include: { folders: true },
  });
};

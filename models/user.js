const pgPool = require("../config/database");

module.exports.createUser = async function (username, password) {
  const query = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [username, password];

  const result = await pgPool.query(query, values);
  return result.rows[0];
};

module.exports.findByUsername = async function (username) {
  const query = `
    SELECT * FROM users
    WHERE username = $1;
  `;
  const values = [username];

  const result = await pgPool.query(query, values);

  console.log(result);

  return result.rows[0];
};

module.exports.findByUserID = async function (userID) {
  const query = `
    SELECT * FROM users
    WHERE id = $1;
  `;
  const values = [userID];

  const result = await pgPool.query(query, values);
  return result.rows[0];
};

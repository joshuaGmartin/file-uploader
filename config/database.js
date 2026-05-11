const { Pool } = require("pg");
require("dotenv").config();

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = { pgPool };

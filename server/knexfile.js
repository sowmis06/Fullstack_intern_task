const dotenv = require("dotenv").config();

module.exports = {
  client: "pg",

  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },

  pool: {
    min: 0,
    max: 5,
  },

  migrations: {
    directory: "./database/migrations",
  },

  seeds: {
    directory: "./database/seeds",
  },
};

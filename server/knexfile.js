const path = require("path");

module.exports = {
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, "database", "templatehub.sqlite"),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, "database", "migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "database", "seeds"),
  },
  pool: {
    afterCreate: (connection, done) => {
      connection.exec("PRAGMA foreign_keys = ON");
      done();
    },
  },
};

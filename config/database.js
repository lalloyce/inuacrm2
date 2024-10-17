/**
 * Import required modules and configure environment variables.
 */
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("system-database", "admin", "password", {
  dialect: "sqlite",
  host: "./database.db",
});

module.exports = sequelize;

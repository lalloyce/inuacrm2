/**
 * Import required modules and configure environment variables.
 */
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const url = require('url');

dotenv.config();

/**
 * Parse a database URL into a configuration object.
 * 
 * @param {string} dbUrl - The database URL to parse.
 * @returns {object} - An object containing the parsed database configuration.
 */
function parseDbUrl(dbUrl) {
  const parsedUrl = new URL(dbUrl);
  return {
    username: parsedUrl.username,
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.substr(1),
    host: parsedUrl.hostname,
    port: parsedUrl.port,
    dialect: 'mysql',
  };
}

/**
 * Define database configurations for different environments.
 */
const config = {
  development: {
    ...parseDbUrl(process.env.DATABASE_URL),
    logging: false,
  },
  test: {
    ...parseDbUrl(process.env.TEST_DATABASE_URL || process.env.DATABASE_URL),
    logging: false,
  },
  production: {
    ...parseDbUrl(process.env.PROD_DATABASE_URL || process.env.DATABASE_URL),
    logging: false,
  }
};

/**
 * Determine the current environment and create a Sequelize instance.
 */
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

/**
 * Export the Sequelize instance and configuration.
 */
module.exports = { sequelize, config };
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const url = require('url');

dotenv.config();

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

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

module.exports = { sequelize, config };
/**
 * Importing required modules for file system operations and path manipulation.
 */
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

/**
 * Importing Sequelize for database operations.
 */
const Sequelize = require('sequelize');

/**
 * Importing the Sequelize instance from database.js
 */
const sequelize = require('../config/database');

/**
 * Initializing an empty object to hold all imported models.
 */
const db = {};

/**
 * Reading all files in the current directory, filtering out non-model files, and importing them.
 * 
 * This process dynamically loads all model files in the directory, excluding the current file (index.js).
 * Each model is imported and added to the db object with its name as the key.
 */
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    if (model.prototype && model.prototype.constructor.name === 'Model') {
      // For Sequelize models defined using `sequelize.define`
      db[model.name] = model(sequelize, Sequelize.DataTypes);
    } else {
      // For Sequelize models defined as classes
      db[model.name] = model.init(sequelize, Sequelize.DataTypes);
    }
  });

/**
 * Associating models with each other.
 * 
 * This process iterates through all models in the db object and calls their associate method if it exists.
 * The associate method is used to define relationships between models.
 */
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

/**
 * Adding the Sequelize instance and Sequelize itself to the db object for external access.
 */
db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * Exporting the db object, which now contains all imported and associated models.
 */
module.exports = db;
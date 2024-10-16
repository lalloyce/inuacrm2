// /**
//  * Importing required modules for file system operations and path manipulation.
//  */
// const fs = require("fs");
// const path = require("path");

// /**
//  * Importing Sequelize for database operations.
//  */
// const Sequelize = require("sequelize");

// /**
//  * Importing database configuration.
//  */
// const config = require("../config/database");

// /**
//  * Creating a new Sequelize instance with database configuration.
//  */
// // const sequelize = new Sequelize(config.database, config.username, config.password, config);

// /**
//  * Initializing an empty object to hold all imported models.
//  */
// const db = {};

// /**
//  * Reading all files in the current directory, filtering out non-model files, and importing them.
//  *
//  * This process dynamically loads all model files in the directory, excluding the current file (index.js).
//  * Each model is imported and added to the db object with its name as the key.
//  */
// fs.readdirSync(__dirname)
//   .filter((file) => file.endsWith(".js") && file !== "index.js")
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes,
//     );
//     db[model.name] = model;
//   });

// /**
//  * Associating models with each other.
//  *
//  * This process iterates through all models in the db object and calls their associate method if it exists.
//  * The associate method is used to define relationships between models.
//  */
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// /**
//  * Adding the Sequelize instance and Sequelize itself to the db object for external access.
//  */
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// /**
//  * Exporting the db object, which now contains all imported and associated models.
//  */
// module.exports = db;

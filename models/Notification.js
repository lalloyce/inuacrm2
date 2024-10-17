/**
 * Importing Sequelize and setting up the database connection.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Defining the Notification model.
 */
class Notification extends Model {}

/**
 * Initializing the Notification model with its attributes.
 * 
 * @param {Object} attributes - The attributes of the Notification model.
 * @param {Object} options - The options for the Notification model.
 */
Notification.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
});

/**
 * Exporting the Notification model.
 */
module.exports = Notification;

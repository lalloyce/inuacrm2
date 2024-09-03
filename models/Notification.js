const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance (if not done in a separate file)
const dotenv = require('dotenv');
const { sequelize } = require('../config/database');

dotenv.config();

const Notification = sequelize.define('Notification', {
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // Add other fields as necessary
}, {
    timestamps: true,
});

module.exports = Notification;
